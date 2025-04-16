import React, { useState, useEffect } from "react";
import {
  GaguListContainer,
  GaguTable,
  GaguListHeader,
  GaguListHeaderRow,
  GaguListHeaderItem,
  GaguListBody,
  GaguItem,
  GaguListItem,
  PaginationContainer,
  PaginationButton,
  GaguImageWrapper,
} from "./css/AdminGaguList.style";

import CommonButton from "../../common/CommonButton";
import { fetchProducts, updateAdminProducts } from "../../api/Admin";

const AdminGaguList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  //페이징 관련
  useEffect(() => {
    const fetchData = async () => {
      try {
        const page = currentPage - 1;
        const res = await fetchProducts(page, itemsPerPage);
        console.log("📦 서버 응답:", res);
        setProducts(res); // 전체 응답 객체를 상태로 저장
        setTotalPages(res.totalPages || 1); // totalPages를 설정
      } catch (err) {
        console.error("❌ 가구 데이터 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [currentPage]);

  // products.content.content가 실제 배열인지 확인
  const isContentArray = Array.isArray(products.content?.content);

  // 전체 선택
  const handleCheckAll = (e) => {
    if (e.target.checked) {
      const ids = products.map((item) => String(item._id));
      setCheckedItems(ids);
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheck = (id) => {
    const stringId = String(id);
    console.log("👉 체크 클릭됨:", stringId);

    setCheckedItems((prev) => {
      const updated = prev.includes(stringId)
        ? prev.filter((item) => item !== stringId)
        : [...prev, stringId];
      console.log("✅ 업데이트된 checkedItems:", updated);
      return updated;
    });
  };

  // 수정 버튼 실행행
  const handleUpdate = async (item) => {
    const newName = prompt("새 이름을 입력하세요", item.name);
    const newdescription = prompt("새 설명을 입력하세요", item.description);

    if (
      (!newName || newName === item.name) &&
      (!newdescription || newdescription === item.description)
    )
      return;

    // _id를 id로 변환하여 updateData에 넣어줌
    const updateData = {
      ...item,
      name: newName,
      description: newdescription,
      id: item.id || item._id,
    };

    try {
      const updated = await updateAdminProducts(updateData.id, updateData); // id 사용

      console.log("✅ 업데이트된 객체:", updated);

      // ✨ 수정된 부분: products.content.content 배열에서 해당 항목만 교체
      setProducts((prev) => {
        const updatedId = updated._id || updated.id;

        const updatedContent = prev.content.content.map((p) => {
          const pId = p._id || p.id;
          return pId === updatedId ? { ...p, ...updated } : p;
        });

        return {
          ...prev,
          content: {
            ...prev.content,
            content: updatedContent,
          },
        };
      });

      alert("수정 성공");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 실패");
    }
  };

  // 전체 선택 체크 여부
  const isAllChecked =
    products.length > 0 &&
    products.every((item) => checkedItems.includes(String(item._id)));

  const renderPagination = () => {
    if (!totalPages || isNaN(totalPages)) return null;

    const paginationNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        paginationNumbers.push(i);
      } else if (paginationNumbers[paginationNumbers.length - 1] !== "...") {
        paginationNumbers.push("...");
      }
    }

    return paginationNumbers.map((page, index) => (
      <PaginationButton
        key={index}
        onClick={() => typeof page === "number" && setCurrentPage(page)}
        disabled={currentPage === page}
      >
        {page}
      </PaginationButton>
    ));
  };

  return (
    <GaguListContainer>
      <GaguTable>
        <GaguListHeader>
          <GaguListHeaderRow>
            <GaguListHeaderItem>
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={handleCheckAll}
              />
            </GaguListHeaderItem>
            <GaguListHeaderItem>번호</GaguListHeaderItem>
            <GaguListHeaderItem>이미지</GaguListHeaderItem>
            <GaguListHeaderItem>가구명</GaguListHeaderItem>
            <GaguListHeaderItem>Description</GaguListHeaderItem>
            <GaguListHeaderItem>등록일</GaguListHeaderItem>
            <GaguListHeaderItem>수정일</GaguListHeaderItem>
            <GaguListHeaderItem>수정</GaguListHeaderItem>
          </GaguListHeaderRow>
        </GaguListHeader>

        {/* // 렌더링할 때, products.content.content가 배열일 경우에만 map을 사용 */}
        <GaguListBody>
          {isContentArray && products.content.content.length > 0 ? (
            products.content.content.map((item, index) => (
              <GaguItem key={item._id}>
                <GaguListItem>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item._id)}
                    onChange={() => handleCheck(item._id)}
                  />
                </GaguListItem>
                <GaguListItem>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </GaguListItem>
                <GaguListItem>
                  <a href={item.link} target="_blank">
                    <GaguImageWrapper
                      style={{ height: "20px", cursor: "pointer" }}
                    >
                      <img src={item.imageUrl} alt="가구" />
                    </GaguImageWrapper>
                  </a>
                </GaguListItem>
                <GaguListItem>{item.name}</GaguListItem>
                <GaguListItem>{item.description}</GaguListItem>
                <GaguListItem>{item.createdAt}</GaguListItem>
                <GaguListItem>{item.updatedAt}</GaguListItem>
                <GaguListItem>
                  <CommonButton
                    style={{ height: "20px" }}
                    fontSize="xxs"
                    type="edit"
                    onClick={() => handleUpdate(item)}
                  >
                    수정
                  </CommonButton>
                </GaguListItem>
              </GaguItem>
            ))
          ) : (
            <div>데이터가 없습니다.</div>
          )}
        </GaguListBody>
      </GaguTable>

      <PaginationContainer>{renderPagination()}</PaginationContainer>
    </GaguListContainer>
  );
};

export default AdminGaguList;

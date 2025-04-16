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
    const ids = products.content.content.map((item) => 
      String(item._id || item.id) // _id 또는 id 사용
    );
    setCheckedItems(ids);
  } else {
    setCheckedItems([]);
  }
};

  const handleCheck = (item) => {
    const { _id, id } = item;
    const stringId = String(_id || id);
  
    if (!stringId) {
      console.log("👉 잘못된 아이디:", _id, id);
      return;
    }
  
    console.log("👉 체크 클릭됨:", stringId);
  
    // checkedItems 배열에 해당 항목을 추가하거나 제거
    setCheckedItems((prevCheckedItems) => {
      // 체크된 항목이면 제거, 아니면 추가
      const updatedCheckedItems = prevCheckedItems.includes(stringId)
        ? prevCheckedItems.filter((item) => item !== stringId) // 이미 체크된 항목을 체크 해제
        : [...prevCheckedItems, stringId]; // 새로운 항목을 체크
  
      console.log("✅ 업데이트된 checkedItems:", updatedCheckedItems);
  
      return updatedCheckedItems; // 상태 업데이트
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
  isContentArray &&
  products.content.content.length > 0 &&
  products.content.content.every((item) => 
    checkedItems.includes(String(item._id)) || checkedItems.includes(String(item.id))
  );

  
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
              <GaguItem key={item.id}>
                <GaguListItem>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(String(item.id))}
                    onChange={() => handleCheck(item)}
                  />
                </GaguListItem>
                <GaguListItem>
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </GaguListItem>
                <GaguListItem>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
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

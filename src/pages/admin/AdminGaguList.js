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

const AdminGaguList = ({ checkedItems = [], setCheckedItems, refreshFlag, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  // ✅ 검색어가 바뀔 때 페이지를 1로 초기화
  useEffect(() => {
    setCurrentPage(1); // 검색어 바뀔 때 페이지를 1로 리셋
  }, [searchTerm]);

  
  // ✅ 페이지, 검색어, 새로고침 신호 있을 때 데이터 불러오기
  useEffect(() => {
    console.log("검색어의 값:", searchTerm);
    const fetchData = async () => {
      try {
        const page = currentPage > 0 ? currentPage - 1 : 0;
        const res = await fetchProducts(page, itemsPerPage, searchTerm);

        console.log("API 응답 데이터:", res); // API 응답 데이터를 확인

        if (res && res.content) {
          setProducts(res.content);  // `content` 부분을 바로 사용
          setTotalPages(res.content.totalPages || 1);
        }
      } catch (err) {
        console.error("❌ 가구 데이터 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [currentPage, refreshFlag, searchTerm]); // `searchTerm`이 바뀌면 이 `useEffect`가 실행됩니다.

  const isContentArray = Array.isArray(products?.content);

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      const ids = products.content.content.map((item) =>
        String(item._id || item.id)
      );
      setCheckedItems(ids);
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheck = (item) => {
    const stringId = String(item._id || item.id);
    if (!stringId) return;

    setCheckedItems((prev) =>
      prev.includes(stringId)
        ? prev.filter((id) => id !== stringId)
        : [...prev, stringId]
    );
  };

  const handleUpdate = async (item) => {
    const newName = prompt("새 이름을 입력하세요", item.name);
    const newDesc = prompt("새 설명을 입력하세요", item.description);

    if (
      (!newName || newName === item.name) &&
      (!newDesc || newDesc === item.description)
    ) return;

    const updateData = {
      ...item,
      name: newName,
      description: newDesc,
      id: item.id || item._id,
    };

    try {
      const updated = await updateAdminProducts(updateData.id, updateData);

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

  const isAllChecked =
    isContentArray &&
    products.content.length > 0 &&
    products.content.every((item) =>
      checkedItems.includes(String(item._id || item.id))
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

        <GaguListBody>
          {isContentArray && products.content.length > 0 ? (
            products.content.map((item, index) => (
              <GaguItem key={item.id}>
                <GaguListItem>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(String(item._id || item.id))}
                    onChange={() => handleCheck(item)}
                  />
                </GaguListItem>
                <GaguListItem>{(currentPage - 1) * itemsPerPage + index + 1}</GaguListItem>
                <GaguListItem>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <GaguImageWrapper style={{ height: "20px", cursor: "pointer" }}>
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
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </GaguListBody>
      </GaguTable>

      <PaginationContainer>{renderPagination()}</PaginationContainer>
    </GaguListContainer>
  );
};

export default AdminGaguList;

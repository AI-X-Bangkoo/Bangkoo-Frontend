import React, { useEffect, useState } from "react";
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
} from "./css/AdminGaguList.style";
import CommonImageBox from "../../common/CommonImageBox";
import CommonButton from "../../common/CommonButton";

// 목업 데이터
const mockData = [
  {
    id: 1,
    imageUrl: "https://via.placeholder.com/150",
    name: "모던 소파",
    description: "편안하고 세련된 모던 소파",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-05",
  },
  {
    id: 2,
    imageUrl: "https://via.placeholder.com/150",
    name: "북유럽 스타일 테이블",
    description: "심플한 디자인의 북유럽 스타일 테이블",
    createdAt: "2025-03-03",
    updatedAt: "2025-03-07",
  },
  {
    id: 3,
    imageUrl: "https://via.placeholder.com/150",
    name: "빈티지 책장",
    description: "빈티지 스타일의 책장",
    createdAt: "2025-03-02",
    updatedAt: "2025-03-06",
  },
  {
    id: 4,
    imageUrl: "https://via.placeholder.com/150",
    name: "러블리 침대",
    description: "아늑하고 사랑스러운 러블리 침대",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-04",
  },
  // 추가 데이터
  {
    id: 5,
    imageUrl: "https://via.placeholder.com/150",
    name: "미니멀 의자",
    description: "단순하고 깔끔한 디자인의 의자",
    createdAt: "2025-03-10",
    updatedAt: "2025-03-12",
  },
];

const AdminGaguList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const [products, setProducts] = useState(mockData);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      const ids = currentItems.map((item) => item.id);
      setCheckedItems(ids);
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderPagination = () => {
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
        {/* 헤더 */}
        <GaguListHeader>
          <GaguListHeaderRow>
            <GaguListHeaderItem>
              <input
                type="checkbox"
                checked={
                  currentItems.length > 0 &&
                  currentItems.every((item) => checkedItems.includes(item.id))
                }
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

        {/* 바디 */}
        <GaguListBody>
          {currentItems.map((item, index) => (
            <GaguItem key={item.id}>
              <GaguListItem>
                <input
                  type="checkbox"
                  checked={checkedItems.includes(item.id)}
                  onChange={() => handleCheck(item.id)}
                />
              </GaguListItem>
              <GaguListItem>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </GaguListItem>
              <GaguListItem>
                <CommonImageBox image={item.imageUrl} type="basic" />
              </GaguListItem>
              <GaguListItem>{item.name}</GaguListItem>
              <GaguListItem>{item.description}</GaguListItem>
              <GaguListItem>{item.createdAt}</GaguListItem>
              <GaguListItem>{item.updatedAt}</GaguListItem>
              <GaguListItem>
                <CommonButton
                  height="90%"
                  fontSize="base"
                  onClick={() => console.log("수정", item.id)}
                >
                  수정
                </CommonButton>
              </GaguListItem>
            </GaguItem>
          ))}
        </GaguListBody>
      </GaguTable>

      {/* 페이지네이션 */}
      <PaginationContainer>{renderPagination()}</PaginationContainer>
    </GaguListContainer>
  );
};

export default AdminGaguList;

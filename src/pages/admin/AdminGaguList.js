import React, { useState } from "react";
import {
  GaguListContainer,
  GaguItem,
  PaginationContainer,
  PaginationButton,
  GaguListHeader,
  GaguListHeaderItem,
  GaguListHeaderSpacer,
} from "./css/AdminGaguList.style";
import CommonImageBox from "../../common/CommonImageBox";
import Button from "../../common/CommonButton";

const AdminGaguList = ({ products = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);

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
        onClick={() => setCurrentPage(page)}
        disabled={currentPage === page}
      >
        {page}
      </PaginationButton>
    ));
  };

  return (
    <GaguListContainer>
      <GaguListHeader>
        <input
          type="checkbox"
          checked={
            currentItems.length > 0 &&
            currentItems.every((item) => checkedItems.includes(item.id))
          }
          onChange={handleCheckAll}
        />
        <GaguListHeaderItem>번호</GaguListHeaderItem>
        <GaguListHeaderItem>이미지</GaguListHeaderItem>
        <GaguListHeaderItem>가구명</GaguListHeaderItem>
        <GaguListHeaderItem>Description</GaguListHeaderItem>
        <GaguListHeaderItem>등록일</GaguListHeaderItem>
        <GaguListHeaderItem>수정일</GaguListHeaderItem>
        <GaguListHeaderSpacer />
      </GaguListHeader>
      <div>
        {currentItems.map((item, index) => (
          <GaguItem key={item.id}>
            <div>``
              <input
                type="checkbox"
                checked={checkedItems.includes(item.id)}
                onChange={() => handleCheck(item.id)}
              />
            </div>
            <div>{(currentPage - 1) * itemsPerPage + index + 1}</div>
            <div>
              <CommonImageBox
                image={item.imageUrl}
                type="basic"
                onLink={item.imageUrl}
              />
            </div>
            <div>{item.name}</div>
            <div>{item.description}</div>
            <div>{item.createdAt}</div>
            <div>{item.updatedAt}</div>
            <div>
              <Button onClick={() => console.log("수정", item.id)}>수정</Button>
            </div>
          </GaguItem>
        ))}
      </div>

      {/* 페이지네이션 */}
      <PaginationContainer>{renderPagination()}</PaginationContainer>
    </GaguListContainer>
  );
};

export default AdminGaguList;

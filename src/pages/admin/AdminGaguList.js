import React, { useState } from "react";
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
import { fontSize } from "@mui/system";

const AdminGaguList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);

  const products = new Array(30).fill(null).map((_, index) => ({
    id: index + 1,
    name: `가구 ${index + 1}`,
    imageUrl: "https://via.placeholder.com/100",
    description: `설명 ${index + 1}`,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  }));

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
              <GaguListItem>
  <CommonImageBox style={{height:"20px"}} image={item.imageUrl} type="basic" onLink={item.imageUrl} />
</GaguListItem>

              </GaguListItem>
              <GaguListItem>{item.name}</GaguListItem>
              <GaguListItem>{item.description}</GaguListItem>
              <GaguListItem>{item.createdAt}</GaguListItem>
              <GaguListItem>{item.updatedAt}</GaguListItem>
              <GaguListItem>
                <CommonButton style={{height:"20px" }}fontSize="xxs" type="edit" onClick={() => console.log("수정")}>
                  수정
                </CommonButton>
              </GaguListItem>
            </GaguItem>
          ))}
        </GaguListBody>
      </GaguTable>

      <PaginationContainer>{renderPagination()}</PaginationContainer>
    </GaguListContainer>
  );
};

export default AdminGaguList;

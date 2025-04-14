import React, { useState, useEffect } from "react";
import axios from "axios";
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

const AdminGaguList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // ✅ MongoDB 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products"); // 실제 API 경로로 교체
        setProducts(res.data);
      } catch (err) {
        console.error("가구 데이터 불러오기 실패:", err);
      }
    };

    fetchProducts();
  }, []);

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
                <CommonImageBox
                  style={{ height: "20px" }}
                  image={item.imageUrl}
                  type="basic"
                  onLink={item.imageUrl}
                />
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
                  onClick={() => console.log("수정", item.id)}
                >
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

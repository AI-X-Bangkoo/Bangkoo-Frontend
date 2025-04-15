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
} from "./css/AdminGaguList.style";
import CommonImageBox from "../../common/CommonImageBox";
import CommonButton from "../../common/CommonButton";
import { fetchProducts, updateAdminProducts } from "../../api/Admin";

const AdminGaguList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 1부터 시작
  const [checkedItems, setCheckedItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const page = currentPage - 1;
        const res = await fetchProducts(page, itemsPerPage);
        console.log("📦 서버 응답:", res);
        setProducts(res.content || []); // 방어 처리
        setTotalPages(res.totalPages || 1); // 방어 처리
      } catch (err) {
        console.error("❌ 가구 데이터 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      const ids = products.map((item) => item._id);
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

  const handleUpdate = async (item) => {
    const newName = prompt("새 이름을 입력하세요", item.name);
    if (!newName || newName === item.name) return;

    const updateData = { ...item, name: newName };
    console.log("수정 데이터:" , updateData);
    try {
      const updated = await updateAdminProducts(item._id, updateData);
      setProducts((prev) =>
        prev.map((p) => (p._id === item._id ? updated : p))
      );
      alert("수정 성공");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 실패");
    }
  };

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
                checked={
                  products.length > 0 &&
                  products.every((item) => checkedItems.includes(item._id))
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
          {products.map((item, index) => (
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
                <CommonImageBox
                  style={{ height: "50px" }}
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
                  onClick={() => handleUpdate(item)}
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

import React, { useState } from "react";
import CommonButton from "../../common/CommonButton";
import { GaguListHeader } from "./css/Admin.styled";
import CommonTextField from "../../common/CommonTextField";
import SearchIcon from "@mui/icons-material/Search";
import GaguRegisterModal from "./ItemRegister";
import { searchProducts, deleteAdminProducts } from "../../api/Admin";

function AdminHeader({ checkedItems, onRefresh, onSearchResults, searchTerm, setSearchTerm }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    onRefresh();
  };

  const handleSearch = async () => {
    console.log("검색어:", searchTerm);
    try {
      const results = await searchProducts(searchTerm, "", "");
      console.log("검색 결과:", results);
      onSearchResults(results); // 부모 컴포넌트로 전달
    } catch (error) {
      console.error("검색 오류:", error);
    }
  };

  const handleClearAll = () => {
    setSearchTerm("");
    onRefresh();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDelete = async () => {
    if (!checkedItems || checkedItems.length === 0) {
      alert("삭제할 항목을 선택해 주세요.");
      return;
    }

    if (!window.confirm(`${checkedItems.length}개 항목을 삭제하시겠습니까?`)) return;

    try {
      await deleteAdminProducts(checkedItems);
      alert("삭제가 완료 되었습니다.");
      onRefresh();
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류 발생");
    }
  };

  return (
    <>
      <h2 style={{ fontSize: "20px", margin: "2% 0 2% 2%" }}>가구목록</h2>

      <GaguListHeader
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #000",
            }}
          >
            <SearchIcon />
            <CommonTextField
              width="180px"
              height="32px"
              placeholder="가구명을 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown} // 엔터 감지
              onClearAll={handleClearAll}
              custom="none"
              fontSize="sx"
            />
          </div>

          <CommonButton
            style={{ height: "32px", padding: "0 12px", fontSize: "14px" }}
            onClick={handleSearch}
          >
            검색
          </CommonButton>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <CommonButton
            type="fill"
            bgColor="green"
            style={{ height: "32px", padding: "0 12px", fontSize: "14px" }}
          >
            CSV 파일 불러오기
          </CommonButton>
          <CommonButton
            style={{ height: "32px", padding: "0 12px", fontSize: "14px" }}
            onClick={handleOpenModal}
          >
            가구 등록
          </CommonButton>
          <CommonButton
            style={{ height: "32px", padding: "0 12px", fontSize: "14px" }}
            type="fill"
            bgColor="red"
            onClick={handleDelete}
          >
            삭제
          </CommonButton>
        </div>
      </GaguListHeader>

      {isModalOpen && <GaguRegisterModal handleClose={handleCloseModal} />}
    </>
  );
}

export default AdminHeader;

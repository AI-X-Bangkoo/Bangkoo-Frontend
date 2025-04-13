import React, { useState } from "react";
import CommonButton from "../../common/CommonButton";
import { GaguListHeader } from "./css/Admin.styled";
import CommonTextField from "../../common/CommonTextField";
import SearchIcon from "@mui/icons-material/Search";
import GaguRegisterModal from "./ItemRegister"; // 가구 등록 모달 컴포넌트 import

function AdminHeader() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSearch = () => {
    console.log("검색어:", searchTerm);
    // 검색 기능 구현!
  };

  const handleClearAll = () => {
    setSearchTerm("");
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
        {/* 검색 영역 */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <SearchIcon />
            <CommonTextField
              width="180px"
              height="32px"
              placeholder="가구명을 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onEnter={handleSearch}
              onClearAll={handleClearAll}
              custom="none"
              line="grey"
              fontSize="sx"
            />
          </div>

          <CommonButton
            style={{ height: "32px", padding: "0 12px", fontSize: "14px" }}
          >
            검색
          </CommonButton>
        </div>

        {/* 버튼 영역 */}
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
          >
            삭제
          </CommonButton>
        </div>
      </GaguListHeader>

      {/* 가구 등록 모달 */}
      {isModalOpen && <GaguRegisterModal handleClose={handleCloseModal} />}
    </>
  );
}

export default AdminHeader;

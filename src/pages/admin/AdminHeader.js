import React, { useState } from "react";
import CommonButton from "../../common/CommonButton";
import { GaguListHeader } from "./css/Admin.styled";
import CommonTextField from "../../common/CommonTextField";
import SearchIcon from "@mui/icons-material/Search";
import GaguRegisterModal from "./ItemRegister"; // 가구 등록 모달 컴포넌트 import
import { searchProducts, deleteAdminProducts } from "../../api/Admin";
import AdminGaguList from "./AdminGaguList"; // AdminGaguList 컴포넌트 import

function AdminHeader({ checkedItems, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    onRefresh();
  };

  //검색 관련
  const handleSearch = async () => {
    console.log("검색어:", searchTerm);
    try {
      // searchProducts 함수를 호출하여 검색 결과를 가져옴
      const results = await searchProducts(searchTerm, "", ""); // name만 검색
      setSearchResults(results); // 결과 상태 업데이트
      console.log("검색 결과:", results);
    } catch (error) {
      console.error("검색 오류:", error);
    }
  };

  const handleClearAll = () => {
    setSearchTerm("");
    onRefresh();
  };

  //삭제 기능 구현
  const handleDelete = async () => {
    if (!checkedItems || checkedItems.length === 0) {
      alert("삭제할 항목을 선택해 주세요.");
      return;
    }

    if (!window.confirm(`${checkedItems.length}개 항목을 삭제하시겠습니까?`))
      return;

    try {
      await deleteAdminProducts(checkedItems); //배열로 삭제 요청
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
        {/* 검색 영역 */}
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
              onEnter={handleSearch}
              onClearAll={handleClearAll}
              custom="none"
              fontSize="sx"
            />
          </div>

          <CommonButton
            style={{ height: "32px", padding: "0 12px", fontSize: "14px" }}
            onClick={handleSearch} // 검색 버튼 클릭 시 검색
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
            onClick={handleDelete}
          >
            삭제
          </CommonButton>
        </div>
      </GaguListHeader>

      {/* 가구 등록 모달 */}
      {isModalOpen && <GaguRegisterModal handleClose={handleCloseModal} />}

      {/* 검색 결과를 AdminGaguList에 전달하여 가구 리스트 렌더링 */}
      <AdminGaguList searchResults={searchResults} />
    </>
  );
}

export default AdminHeader;

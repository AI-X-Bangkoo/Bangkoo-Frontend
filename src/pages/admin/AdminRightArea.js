import React from "react";
import AdminGaguList from "./AdminGaguList";
import AdminHeader from "./AdminHeader";
import { RightArea } from "./css/Admin.styled";

function AdminRightArea({ selectedMenu }) {
  return (
    <RightArea>
      <AdminHeader />
      {selectedMenu === "gagu" && <AdminGaguList />}
      {/* 다른 메뉴가 생기면 여기 조건 추가 가능 */}
    </RightArea>
  );
}

export default AdminRightArea;

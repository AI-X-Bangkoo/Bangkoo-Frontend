import React, { useState } from "react";
import AdminGaguList from "./AdminGaguList";
import AdminHeader from "./AdminHeader";
import { RightArea } from "./css/Admin.styled";

function AdminRightArea({ selectedMenu }) {

  const [checkedItems, setCheckedItems] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev); // 새로고침 트리거용
  };

  return (
    <RightArea>
     <AdminHeader
      checkedItems={checkedItems}
      onRefresh={handleRefresh}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
        />
      {/* {selectedMenu === "gagu" && ( */}
        <AdminGaguList
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          refreshFlag={refreshFlag}
          searchTerm={searchTerm}
        />
      {/* )} */}
    </RightArea>
  );
}

export default AdminRightArea;

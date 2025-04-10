/**
 * 관리자 페이지의 왼쪽 영역과
 * 오른쪽 영역의 합친 컴포넌트
 */

import React from "react";
import Header from "../header/Header";
import AdminLeftArea from "./AdminLeftArea";
import AdminRightArea from "./AdminRightArea";


function AdminDashBoard(){
return(
    <HomeRoot>
        <Header/>
        <AdminLeftArea/>
        <AdminRightArea/>
    </HomeRoot>
)
}

export default AdminDashBoard;
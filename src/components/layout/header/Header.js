import React from "react";
import {HeaderRoot, LoginBox} from "./Header.styled";
import { Text } from "../../../common/Typography";
import { ReactComponent as Logo } from "../../../assets/images/Logo.svg";
import { ReactComponent as KaKao } from "../../../assets/images/KaKao.svg";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/login/useAuth";
import CommonDialog from "../../../common/CommonDialog";

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, toggleLogin, alertMessage, setAlertMessage} = useAuth();

  const goToMain = () => {
    navigate("/"); // 홈 화면으로 리다이렉트
  };

    const handleDialogClose = () => {
        setAlertMessage(null); // 메시지 초기화
    };

  return (
    <HeaderRoot>
      <Logo onClick={goToMain} />
        <LoginBox>
            <KaKao/>
            <Text
                size="sm"
                $weight={600}
                style={{ cursor: "pointer" }}
                onClick={toggleLogin} // 로그인/로그아웃 토글
            >
                {isLoggedIn ? "로그아웃" : "로그인"}
                {/* 로그인 상태에 따라 텍스트 변경 */}
            </Text>
        </LoginBox>

        {alertMessage && (
            <CommonDialog
                open={!!alertMessage}
                onClose={handleDialogClose}
                onClick={handleDialogClose}
                title="알림"
                cancel={false}
                submitText="확인"
            >
                <div style={{display:"flex", justifyContent: "center"}}>
                    <Text size="sm">{alertMessage}</Text>
                </div>

            </CommonDialog>
        )}
    </HeaderRoot>
  );
};

export default Header;

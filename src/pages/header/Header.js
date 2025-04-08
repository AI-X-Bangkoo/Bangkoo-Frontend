import React from "react";
import { HeaderRoot } from "./Header.styled";
import { Text } from "../../common/Typography";
import { ReactComponent as Logo } from "../../assets/images/Logo.svg";
import { useNavigate } from "react-router-dom";
import useKakaoLogin from "../../hooks/useKakaoLogin";

const Header = () => {
  const navigate = useNavigate();
  const { kakaoLogin } = useKakaoLogin();

  const goToMain = () => {
    navigate("/");
  };

  return (
    <HeaderRoot>
      <Logo onClick={goToMain} />
      <Text
        size="sm"
        $weight={600}
        style={{ cursor: "pointer" }}
        onClick={kakaoLogin}
      >
        {isLoggedIn ? "로그아웃" : "로그인"}
        {/* 로그인 상태에 따라 텍스트 변경 */}
      </Text>
    </HeaderRoot>
  );
};

export default Header;

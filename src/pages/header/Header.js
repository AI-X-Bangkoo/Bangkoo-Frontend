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
        로그인
      </Text>
    </HeaderRoot>
  );
};

export default Header;

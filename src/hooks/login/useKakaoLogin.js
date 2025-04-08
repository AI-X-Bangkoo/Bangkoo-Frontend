import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useKakaoLogin = () => {
  const navigate = useNavigate();

  const REST_API_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  const KAKAO_AUTH_URL =
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code`;

  const kakaoLogin = () => {
    if (!REST_API_KEY || !REDIRECT_URI) {
      alert("카카오 설정이 잘못되었습니다.");
      return;
    }

    console.log("✅ 카카오 로그인 요청");
    window.location.href = KAKAO_AUTH_URL; // 항상 새롭게 요청됨
  };

  return { kakaoLogin };
};

export default useKakaoLogin;

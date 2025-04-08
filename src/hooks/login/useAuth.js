import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useKakaoLogin from "./useKakaoLogin"; // 카카오 로그인 훅
import axios from "axios";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // 로그인 요청 상태 관리
  const { kakaoLogin } = useKakaoLogin(); // 카카오 로그인 요청 함수
  const navigate = useNavigate();

  useEffect(() => {
    const cookie = document.cookie;
    const nicknameMatch = cookie.match(/nickname=([^;]+)/);

    if (nicknameMatch) {
      setIsLoggedIn(true);
      setUser({ nickname: decodeURIComponent(nicknameMatch[1]) });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []); // 빈 배열을 넣어 최초 렌더링 시만 실행되도록

  // 로그인 요청 (카카오 로그인)
  const login = useCallback(async () => {
    if (isLoggingIn) return; // 이미 로그인 요청이 진행 중이라면 중복 호출 방지
    setIsLoggingIn(true); // 로그인 요청 중 상태로 설정

    try {
      await kakaoLogin(); // 카카오 로그인 요청
      setIsLoggingIn(false); // 요청 완료 후 상태 초기화
    } catch (error) {
      console.error("로그인 실패:", error);
      setIsLoggingIn(false); // 요청 실패 시에도 상태 초기화
    }
  }, [isLoggingIn, kakaoLogin]);

  // 로그아웃 함수 (쿠키 삭제 및 상태 초기화)
  const logout = async () => {
    try {
      // 로그아웃 API 호출 (서버에서 로그아웃 처리)
      await axios.post("http://localhost:6816/auth/logout", null, {
        withCredentials: true,
      });

      // 쿠키에서 nickname 삭제
      document.cookie = "nickname=; Max-Age=0; path=/;";

      // 로그인 상태 초기화
      setIsLoggedIn(false);
      setUser(null);

      // 로그아웃 후 홈 화면으로 리다이렉트
      alert("로그아웃 되었습니다.");
      navigate("/", { replace: true }); // 홈 화면으로 리다이렉트
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃 실패. 다시 시도해주세요.");
    }
  };

  // 로그인 상태 토글 함수
  const toggleLogin = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login();
    }
  };

  // 로그인 성공 후 닉네임을 쿠키에 저장하고 상태 업데이트
  const setLoginInfo = (nickname) => {
    if (nickname) {
      document.cookie = `nickname=${encodeURIComponent(nickname)}; path=/;`;
      setIsLoggedIn(true);
      setUser({ nickname });
    }
  };

  return {
    isLoggedIn,
    user,
    login,
    logout,
    toggleLogin,
    setLoginInfo,
  };
};

export default useAuth;

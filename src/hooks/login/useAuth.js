import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useKakaoLogin from "./useKakaoLogin"; // 카카오 로그인 훅
import { useEffect } from "react";
import {
  checkLoginFromCookie,
  setLoginInfo,
  setAlertMessage,
  clearAlertMessage,
  logoutThunk,
} from "../../features/auth/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { kakaoLogin } = useKakaoLogin();

  // Redux 상태에서 로그인 상태, 사용자 정보, alertMessage 가져오기
  const { isLoggedIn, user, alertMessage } = useSelector((state) => state.auth);

  // 로그인 함수 (카카오 로그인 호출)
  const login = async () => {
    try {
      await kakaoLogin();
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // logoutThunk로 로그아웃 처리
      await dispatch(logoutThunk());
      
      // 쿠키 삭제
      document.cookie = "nickname=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

      // 페이지 이동 처리
      navigate("/", { replace: true });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 로그인 상태 토글 함수
  const toggleLogin = () => {
    isLoggedIn ? logout() : login();
  };

  // 로그인 성공 후 호출되는 함수
  const handleLoginSuccess = (nickname, role) => {
    console.log('✅ handleLoginSuccess 호출:', nickname, role);

    const userRole = role || 'user'; // 백엔드에서 role이 없으면 'user'로 기본 설정
    console.log('📦 최종 userRole:', userRole);

    // Redux에 로그인 정보 저장
    dispatch(setLoginInfo({
      nickname: nickname,
      role: userRole,
    }));

    // 쿠키에 로그인 정보 저장
    document.cookie = `nickname=${nickname}; path=/`;
    document.cookie = `role=${userRole}; path=/`;

    console.log('쿠키 저장:', document.cookie);
  };

  // 로그인 상태 초기화 (쿠키에서 상태 확인)
  useEffect(() => {
    dispatch(checkLoginFromCookie());
  }, [dispatch]);

  // 관리자 여부 확인 (user?.role을 직접 체크)
  const isAdmin = user?.role === "admin";
  
  return {
    isLoggedIn,
    isAdmin, // 이미 계산된 값 사용
    user,
    login,
    logout,
    toggleLogin,
    alertMessage,
    setAlertMessage: (msg) => dispatch(setAlertMessage(msg)),
    clearAlertMessage: () => dispatch(clearAlertMessage()),
    handleLoginSuccess,
  };
};

export default useAuth;

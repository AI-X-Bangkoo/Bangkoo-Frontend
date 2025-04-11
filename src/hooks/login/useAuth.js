import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useKakaoLogin from "./useKakaoLogin"; // 카카오 로그인 훅
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

  const { isLoggedIn, user, alertMessage } = useSelector((state) => state.auth);

  const login = () => {
    kakaoLogin();
  };

  const logout = () => {
    dispatch(logoutThunk());
    navigate("/", { replace: true });
  };

  const toggleLogin = () => {
    isLoggedIn ? logout() : login();
  };

  const handleLoginSuccess = (nickname) => {
    dispatch(setLoginInfo({ nickname }));
  };

  const initLogin = () => {
    dispatch(checkLoginFromCookie());
  };

  return {
    isLoggedIn,
    user,
    login,
    logout,
    toggleLogin,
    alertMessage,
    setAlertMessage: (msg) => dispatch(setAlertMessage(msg)),
    clearAlertMessage: () => dispatch(clearAlertMessage()),
    handleLoginSuccess,  
    initLogin,
  };
};

export default useAuth;
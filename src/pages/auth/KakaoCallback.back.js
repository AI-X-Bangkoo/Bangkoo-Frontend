import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/login/useAuth";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { setLoginInfo } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // 메시지 (dialog) - 지은
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    if (isProcessing) return;

    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      setAlertMessage("로그인 실패: 유효하지 않은 접근입니다.");
      // alert("로그인 실패: 유효하지 않은 접근입니다.");
      navigate("/", { replace: true });
      return;
    }

    setIsProcessing(true);

    axios
      .post(`http://localhost:8080/auth/callback/kakao?code=${code}`, null, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("전체 응답 객체:", res);
        console.log("서버 응답 데이터:", res.data);

        const { nickname, role } = res.data; // ✅ role도 함께 구조분해

        if (nickname, role) {
          handleLoginSuccess(nickname, role); // ✅ role 포함해서 전달
          navigate("/", { replace: true });
        } else {
          setAlertMessage("로그인 실패: 서버 응답 오류");
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.error("로그인 실패:", err);
        setAlertMessage("로그인 실패. 다시 시도해주세요.");
        navigate("/", { replace: true });
      })
      .finally(() => setIsProcessing(false));
  }, []);

  return <div>로그인 처리 중입니다...</div>;
};

export default KakaoCallback;
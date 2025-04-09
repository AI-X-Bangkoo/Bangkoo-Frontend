import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../hooks/login/useAuth";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { setLoginInfo } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isProcessing) return;

    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      alert("로그인 실패: 유효하지 않은 접근입니다.");
      navigate("/", { replace: true });
      return;
    }

    setIsProcessing(true);

    axios
      .post(`http://localhost:6816/auth/callback/kakao?code=${code}`, null, {
        withCredentials: true, // ✅ 쿠키를 서버에서 받을 수 있게 설정
      })
      .then((res) => {
           console.log("전체 응답 객체:", res);
           console.log(
             " 쿠키가 응답에 포함되었는지? (headers):",
             res.headers
           );
           console.log(" 서버 응답 데이터:", res.data);

        const { nickname } = res.data;

        if (nickname) {
          // JWT는 쿠키로 받고, nickname은 직접 전달받음
          setLoginInfo(nickname); // token은 쿠키로 처리하므로 null
          alert("✅ 로그인 성공");
          navigate("/", { replace: true });
        } else {
          console.error("서버 응답 문제:", res.data);
          alert("로그인 실패: 서버 응답 오류");
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        console.error("로그인 실패:", err);
        alert("로그인 실패. 다시 시도해주세요.");
        navigate("/", { replace: true });
      })
      .finally(() => setIsProcessing(false));
  }, []);

  return <div>로그인 처리 중입니다...</div>;
};

export default KakaoCallback;

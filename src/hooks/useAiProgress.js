// 📁 hooks/useAiProgress.js
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { startAnalysis, endAnalysis } from "@/features/ai/aiSlice";

/**
 * ✅ AI 분석 진행 상태를 0~100까지 자동으로 증가시키는 커스텀 훅
 * 작성자: 김태원
 *
 * @param {Function} onComplete - 100%에 도달했을 때 실행할 콜백 함수
 * @param {number} [step=5] - 진행률 증가 간격 (기본 5%)
 * @param {number} [interval=200] - 진행률 갱신 주기(ms, 기본 200ms)
 * @returns {number} progress - 현재 진행률 (0~100)
 */
export const useAiProgress = (onComplete, step = 5, interval = 200) => {
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    dispatch(startAnalysis());
    setProgress(0); // 시작 시 0으로 초기화

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          dispatch(endAnalysis());
          if (onComplete) onComplete(); // 콜백 실행
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 정리
  }, []);

  return progress;
};

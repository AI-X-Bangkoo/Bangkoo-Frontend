// ✅ hooks/usePlacementHistory.js
// ✅ 작성자: 김태원
// ✅ 기능 요약: AI 배치 결과에 대한 상태 히스토리를 Redis에 저장/되돌리기 위한 커스텀 훅

import { useState } from "react";
import {
  pushPlacementState,
  undoPlacementState,
  redoPlacementState,
  getCurrentPlacementState,
} from "@/api/redis";

/**
 * ✅ Redis 기반 Undo/Redo/SaveState 기능을 제공하는 커스텀 훅
 * - AI 결과를 히스토리로 관리
 * - 캔버스 및 미리보기 동기화에 활용
 */
export const usePlacementHistory = () => {
  // 🔸 현재 이미지(base64)를 로컬 state로 관리 (프론트 동기화용)
  const [currentImage, setCurrentImage] = useState(null);

  /**
   * ✅ 상태 저장 함수 (최신 base64 이미지 Redis에 push)
   * @param {string} base64Image - 저장할 이미지 데이터
   */
  const saveState = async (base64Image) => {
    try {
      await pushPlacementState(base64Image);     // Redis에 push
      setCurrentImage(base64Image);              // 프론트 미리보기용 state 업데이트
    } catch (err) {
      console.error("상태 저장 실패:", err);
    }
  };

  /**
   * ✅ 이전 상태로 되돌리기 (Undo)
   * @returns {string|null} - 이전 상태 이미지(base64) 반환
   */
  const undo = async () => {
    try {
      const prevImage = await undoPlacementState(); // Redis에서 pop
      if (prevImage) setCurrentImage(prevImage);
      return prevImage;
    } catch (err) {
      console.error("undo 실패:", err);
      return null;
    }
  };

  /**
   * ✅ 다음 상태로 다시 실행 (Redo)
   * @returns {string|null} - 다음 상태 이미지(base64) 반환
   */
  const redo = async () => {
    try {
      const nextImage = await redoPlacementState(); // Redis에서 forward
      if (nextImage) setCurrentImage(nextImage);
      return nextImage;
    } catch (err) {
      console.error("redo 실패:", err);
      return null;
    }
  };

  /**
   * ✅ 현재 상태 불러오기 (앱 로드시 동기화용)
   */
  const loadCurrent = async () => {
    try {
      const current = await getCurrentPlacementState(); // Redis에서 peek
      if (current) setCurrentImage(current);
    } catch (err) {
      console.error("현재 상태 로드 실패:", err);
    }
  };

  // 🔹 외부에서 사용할 함수들 리턴
  return {
    currentImage,  // 프론트에서 현재 상태 미리보기에 활용 가능
    saveState,
    undo,
    redo,
    loadCurrent,
  };
};

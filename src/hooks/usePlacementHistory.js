// src/hooks/usePlacementHistory.js
import { useState } from "react";
import {
  pushPlacementState,
  undoPlacementState,
  redoPlacementState,
  getCurrentPlacementState,
} from "@/api/redis";

export const usePlacementHistory = () => {
  const [currentImage, setCurrentImage] = useState(null);

  const saveState = async (base64Image) => {
    try {
      await pushPlacementState(base64Image);
      setCurrentImage(base64Image);
    } catch (err) {
      console.error("상태 저장 실패:", err);
    }
  };

  const undo = async () => {
    try {
      const prevImage = await undoPlacementState();
      if (prevImage) setCurrentImage(prevImage);
    } catch (err) {
      console.error("undo 실패:", err);
    }
  };

  const redo = async () => {
    try {
      const nextImage = await redoPlacementState();
      if (nextImage) setCurrentImage(nextImage);
    } catch (err) {
      console.error("redo 실패:", err);
    }
  };

  const loadCurrent = async () => {
    try {
      const current = await getCurrentPlacementState();
      if (current) setCurrentImage(current);
    } catch (err) {
      console.error("현재 상태 로드 실패:", err);
    }
  };

  return {
    currentImage,
    saveState,
    undo,
    redo,
    loadCurrent,
  };
};

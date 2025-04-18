// api/redis.js
// 작성자: 김태원
// Redis 기반 상태 히스토리 관리 API

import api from "./axios";

/**
 * 📌 현재 상태 저장 (undo stack에 push)
 * @param {string} base64 - base64 문자열
 */
export async function pushPlacementState(base64) {
  return await api.post("/api/redis/state", base64, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 🔙 되돌리기 (undo)
 * - 이전 상태를 불러온다
 * @returns {Promise<string|null>} - base64 문자열 또는 null
 */
export async function undoPlacementState() {
  const response = await api.post("/api/redis/undo");
  return response.data;
}

/**
 * 🔁 다시 실행 (redo)
 * - 되돌리기를 취소하고 이후 상태로 복원
 * @returns {Promise<string|null>} - base64 문자열 또는 null
 */
export async function redoPlacementState() {
  const response = await api.post("/api/redis/redo");
  return response.data;
}

/**
 * 📂 현재 상태 조회
 * - 가장 최근 저장된 base64 이미지
 * @returns {Promise<string|null>} - base64 문자열 또는 null
 */
export async function getCurrentPlacementState() {
  const response = await api.get("/api/redis/state");
  return response.data;
}

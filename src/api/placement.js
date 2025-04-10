// src/api/placement.js
import api from "./axios";

/**
 * AI 배치 요청 (이미지 업로드 포함)
 * @param {'remove' | 'add'} mode
 * @param {Blob} backgroundBlob
 * @param {Blob=} referenceBlob
 * @returns {Promise<string>} base64 이미지 결과
 */
export async function requestPlacement(mode, backgroundBlob, referenceBlob = null) {
  const formData = new FormData();
  formData.append("mode", mode);
  formData.append("background", backgroundBlob, "bg.png");
  if (mode === "add" && referenceBlob) {
    formData.append("reference", referenceBlob, "ref.png");
  }

  const response = await api.post("/api/placement", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });

  return response.data; // base64 문자열 (or 응답 전체 구조 확인 필요)
}

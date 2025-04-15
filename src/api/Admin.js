/**
 * 관리자 페이지 API
 * 
 * 조회, 등록, 삭제, 수정
 */

import api from "./axios"; // 또는 실제 axios 인스턴스 경로

// 조회
export async function fetchAdminProducts() {
  try {
    const response = await api.get("/api/admin/products");
    return response.data; // 배열 형태의 가구 목록
  } catch (error) {
    console.error("가구 목록 조회 실패:", error);
    throw error; // 오류를 다시 던져서 호출한 곳에서 처리하도록 할 수 있음
  }
}

// 등록
export async function createAdminProducts(productData) {
  try {
    const response = await api.post("/api/admin/products", productData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("가구 등록 실패:", error);
    throw error;
  }
}

// 삭제
export async function deleteAdminProducts(id) {
  try {
    const response = await api.delete(`/api/admin/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("가구 삭제 실패:", error);
    throw error;
  }
}

// 수정
export async function updateAdminProducts(id, updateData) {
  try {
    const response = await api.put(`/api/admin/products/${id}`, updateData, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("가구 수정 실패:", error);
    throw error;
  }
}

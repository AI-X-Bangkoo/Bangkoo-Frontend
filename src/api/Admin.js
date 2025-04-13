/**
 * 관리자 페이지 API
 * 
 * 조회, 등록, 삭제, 수정
 */

import api from "./axios"; // 또는 실제 axios 인스턴스 경로

// 조회
export async function fetchAdminProducts() {
  const response = await api.get("/api/admin/products");
  return response.data;   // 배열 형태의 가구 목록
}

// 등록
export async function createAdminProducts(productData) {
  const response = await api.post("/api/admin/products", productData, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}

// 삭제
export async function deletAdminProducts(id) {
  const response = await api.delete(`/api/admin/products/${id}`);
  return response.data;
}

// 수정
export async function updateAdminProducts(id, updateData) {
  const response = await api.put(`/api/admin/products/${id}`, updateData, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}

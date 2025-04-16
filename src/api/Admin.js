// src/api/Admin.js

import api from "./axios";

// 전체 조회 (페이징 포함)
export async function fetchProducts(page = 0, size = 10) {
  try {
    const res = await api.get("/api/admin/product", {
      params: { page, size },
    });
    console.log("응답 성공:", res);
    return {
      content: res.data, // 배열을 content로 래핑
      totalPages: 1,     // 현재 API에 페이지 정보 없으므로 1로 임시 설정
    };
  } catch (error) {
    console.error("가구 목록 조회 실패:", error.response || error.message);
    throw error;
  }
}
// 등록
export async function createAdminProducts(productData) {
  try {
    const response = await api.post("/api/admin/product/save", productData, {
      headers: { "Content-Type": "application/json" },
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
    const response = await api.delete(`/api/admin/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("가구 삭제 실패:", error);
    throw error;
  }
}

// 수정
export async function updateAdminProducts(id, updateData) {
  try {
    const response = await api.put(`/api/admin/product/${id}`, updateData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("업데이트된 객체:", JSON.stringify(updateData, null, 2));
    console.log("*******",updateData);
    return response.data;
  } catch (error) {
    console.error("가구 수정 실패:", error);
    throw error;
  }
}

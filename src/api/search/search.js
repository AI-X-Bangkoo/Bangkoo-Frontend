import api from "../axios";

// 텍스트 기반 검색
export const searchByText = async (query) => {
    const formData = new FormData();
    formData.append("query", query);

    const response = await api.post("/api/search", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

// 이미지 파일 기반 검색
export const searchByImage = async (formData) => {
    const res = await api.post("/api/search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// 이미지 링크 기반 검색
export const searchByImageUrl = async (imageUrl) => {
    const formData = new FormData();
    formData.append("image_url", imageUrl);

    const res = await api.post("/api/search", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// 1. 검색 로그 저장 (로그인한 사용자만 저장)
export const saveSearchLog = async (query, userId, source = "text") => {
    if (!query || !userId || userId === "anonymous") return;
  
    try {
      await api.post("/search-logs", null, {
        params: { query, userId, source },
      });
    } catch (error) {
      console.error("검색 로그 저장 실패:", error);
    }
  };
  
// 2. 최근 검색어 조회
export const fetchRecentSearches = async (userId, limit = 10) => {
    try {
      const res = await api.get("/search-logs/recent", {
        params: { userId, limit },
      });
      return res.data;
    } catch (error) {
      console.error("최근 검색어 조회 실패:", error);
      return [];
    }
  };

  // 3. 인기 검색어 조회
export const fetchPopularSearches = async (limit = 10) => {
    try {
      const res = await api.get("/search-logs/popular", {
        params: { limit },
      });
      return res.data;
    } catch (error) {
      console.error("인기 검색어 조회 실패:", error);
      return [];
    }
  };

// 4. 특정 검색어 삭제
export const deleteSearchItem = async (userId, query) => {
    try {
      await api.delete("/search-logs/item", {
        params: { userId, query },
      });
    } catch (error) {
      console.error("검색어 개별 삭제 실패:", error);
    }
  };

// 5. 모든 검색어 삭제
export const deleteAllSearchLogs = async (userId) => {
    try {
      await api.delete("/search-logs", {
        params: { userId },
      });
    } catch (error) {
      console.error("검색어 전체 삭제 실패:", error);
    }
  };
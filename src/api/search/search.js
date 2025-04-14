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

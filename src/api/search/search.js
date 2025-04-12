import api from "../axios";

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

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 주소
  withCredentials: true, // 쿠키를 포함한 요청 허용
});

// 🔥 인터셉터 추가 (JWT 자동으로 Authorization에 붙이기)
api.interceptors.request.use(
  (config) => {
    // 쿠키에서 accessToken을 가져오기
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    ); // accessToken이 담긴 쿠키를 찾아 가져옴

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// api/axios.js
import axios from "axios"
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: "http://localhost:8080",   //백엔드 주소
    withCredentials: true,  //쿠키를 포함한 요청 허용
})



api.interceptors.request.use((config) => {
    const token = Cookies.get("jwtToken"); // JWT 토큰 가져오기
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // 토큰을 Authorization 헤더에 추가
    }
    return config;
  });
export default api;

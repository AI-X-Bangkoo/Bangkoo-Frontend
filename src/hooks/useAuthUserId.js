import Cookies from "js-cookie";

export default function useAuthUserId() {
    const cookie = document.cookie;
    const match = cookie.match(/userId=([^;]+)/);

    if (match && match[1]) {
        const userId = decodeURIComponent(match[1]);
        return userId;
    }

    return "anonymous";
}

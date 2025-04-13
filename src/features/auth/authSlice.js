import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            await api.post("/auth/logout");
            document.cookie = "nickname=; Max-Age=0; path=/;";
        } catch (err) {
            return thunkAPI.rejectWithValue("로그아웃 실패. 다시 시도해주세요.");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        user: null,
        alertMessage: null,
    },
    reducers: {
        checkLoginFromCookie: (state) => {
            const match = document.cookie.match(/nickname=([^;]+)/);
            const nickname = match ? decodeURIComponent(match[1]) : null;

            // 상태가 바뀔 필요 없으면 그냥 리턴
            if (nickname && state.user?.nickname === nickname) return;
            if (!nickname && !state.user) return;

            if (nickname) {
                state.isLoggedIn = true;
                state.user = { nickname };
            } else {
                state.isLoggedIn = false;
                state.user = null;
            }
        },
        setLoginInfo: (state, action) => {
            const { nickname } = action.payload;
            document.cookie = `nickname=${encodeURIComponent(nickname)}; path=/;`;
            state.isLoggedIn = true;
            state.user = { nickname };
        },
        setAlertMessage: (state, action) => {
            state.alertMessage = action.payload;
        },
        clearAlertMessage: (state) => {
            state.alertMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutThunk.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.user = null;
                state.alertMessage = "로그아웃 되었습니다.";
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.alertMessage = action.payload;
            });
    },
});

export const {
    checkLoginFromCookie,
    setLoginInfo,
    setAlertMessage,
    clearAlertMessage,
} = authSlice.actions;
export default authSlice.reducer;
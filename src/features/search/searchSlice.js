import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    keyword: '',         // 사용자가 입력한 검색어
    uploadedImage: null, // 업로드한 이미지 (URL or File)
    recentKeywords: [], // 검색 히스토리 추가
    autoSave: true // 자동 저장 on/off
};


const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setKeyword: (state, action) => {
            state.keyword = action.payload;
        },
        setUploadedImage: (state, action) => {
            state.uploadedImage = action.payload;
        },
        addRecentKeyword: (state, action) => {
            const keyword = action.payload.trim();
            if (!keyword) return;

            // 중복 제거
            state.recentKeywords = state.recentKeywords.filter(k => k !== keyword);
            state.recentKeywords.unshift(keyword); // 앞에 추가

            // 최대 10개 유지
            if (state.recentKeywords.length > 10) {
                state.recentKeywords.pop();
            }
        },
        removeRecentKeyword: (state, action) => {
            const keyword = action.payload;
            state.recentKeywords = state.recentKeywords.filter(k => k !== keyword);
        },
        clearRecentKeywords: (state) => {
            state.recentKeywords = [];
        },
        clearSearch: (state) => {
            state.keyword = '';
            state.uploadedImage = null;
        },
        toggleAutoSave: (state) => {
            state.autoSave = !state.autoSave;
        },
    },
});

export const {
    setKeyword,
    setUploadedImage,
    clearSearch,
    addRecentKeyword,
    removeRecentKeyword,
    clearRecentKeywords,
    toggleAutoSave
} = searchSlice.actions;
export default searchSlice.reducer;

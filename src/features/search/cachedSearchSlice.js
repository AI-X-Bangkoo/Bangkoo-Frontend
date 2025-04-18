import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cache: {}
};

const cachedSearchSlice = createSlice({
    name: 'cachedSearch',
    initialState,
    reducers: {
        // 결과 저장
        setCachedResults: (state, action) => {
            const { keyword, results } = action.payload;
            if (!keyword) return;
            if (!state.cache[keyword]) {
                state.cache[keyword] = {};
            }
            state.cache[keyword].results = results;
        },

        // 체크 상태 저장
        setCachedCheckedIds: (state, action) => {
            const { keyword, checkedIds } = action.payload;
            if (!keyword) return;
            if (!state.cache[keyword]) {
                state.cache[keyword] = {};
            }
            state.cache[keyword].checkedIds = checkedIds;
        },

        // 키워드에 해당하는 캐시 전체 제거
        clearCachedKeyword: (state, action) => {
            const keyword = action.payload;
            if (state.cache[keyword]) {
                delete state.cache[keyword];
            }
        },

        // 전체 캐시 초기화
        clearAllCachedSearch: (state) => {
            state.cache = {};
        },
    }
});

export const {
    setCachedResults,
    setCachedCheckedIds,
    clearCachedKeyword,
    clearAllCachedSearch
} = cachedSearchSlice.actions;

export default cachedSearchSlice.reducer;

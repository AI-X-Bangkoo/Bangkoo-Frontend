import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
};

const recommendedSlice = createSlice({
    name: "recommended",
    initialState,
    reducers: {
        setRecommendedFurniture: (state, action) => {
            state.list = action.payload;
        },
        removeRecommendedFurniture: (state, action) => {
            state.list = state.list.filter(item => item.id !== action.payload);
        },
        clearRecommendedFurniture: (state) => {
            state.list = [];
        },
    },
});

export const {
    setRecommendedFurniture,
    removeRecommendedFurniture,
    clearRecommendedFurniture,
} = recommendedSlice.actions;

export default recommendedSlice.reducer;
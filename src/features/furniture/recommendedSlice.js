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
    },
});

export const {
    setRecommendedFurniture,
} = recommendedSlice.actions;

export default recommendedSlice.reducer;
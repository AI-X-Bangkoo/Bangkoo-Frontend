import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [],
};

const interiorSlice = createSlice({
    name: 'interior',
    initialState,
    reducers: {
        setInterior: (state, action) => {
            state.list = action.payload;
        },
        removeInterior: (state, action) => {
            state.list = state.list.filter(item => item.id !== action.payload);
        },
        removeAllInterior: (state) => {
            state.list = [];
        },
    },
});

export const { setInterior, removeInterior, removeAllInterior } = interiorSlice.actions;
export default interiorSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [],
};

const furnitureSlice = createSlice({
    name: 'furniture',
    initialState,
    reducers: {
        addFurniture: (state, action) => {
            // state.list.push(action.payload);
            state.list = state.list.map(item =>
                item.id === action.payload
                    ? { ...item, type: 'eyeOn' } // + 아이콘 보이게 변경
                    : item
            );
        },
        removeFurniture: (state, action) => {
            // state.list = state.list.filter(item => item.id !== action.payload);
            state.list = state.list.map(item =>
                item.id === action.payload
                    ? { ...item, type: 'eyeClosed' } // + 아이콘 보이게 변경
                    : item
            );
        },
        toggleFurniture: (state, action) => {
            state.list = state.list.map(item =>
                item.id === action.payload
                    ? { ...item, type: item.type === 'hoverMinus' ? 'hoverPlus' : 'hoverMinus' }
                    : item
            );
        },
        setInitialFurniture: (state, action) => {
            state.list = action.payload;
        },
        // 검색 -> 체크한 리스트 나의가구에 추가
        appendFurniture: (state, action) => {
            const newItem = action.payload;
            const exists = state.list.some(item => item.id === newItem.id);
            if (!exists) {
                state.list.push(newItem);
            } else {
            }
        },
    },
});

export const {
    addFurniture,
    removeFurniture,
    toggleFurniture,
    setInitialFurniture,
    appendFurniture
} = furnitureSlice.actions;
export default furnitureSlice.reducer;
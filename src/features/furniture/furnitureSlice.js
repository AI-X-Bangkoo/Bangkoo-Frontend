import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [],
};

const furnitureSlice = createSlice({
    name: 'furniture',
    initialState,
    reducers: {
        addFurniture: (state, action) => {
            // 아이템을 추가하는 방식으로 수정
            state.list.push(action.payload);
        },
        removeFurniture: (state, action) => {
            state.list = state.list.map(item =>
                item.id === action.payload
                    ? { ...item, type: 'eyeClosed' } // 아이콘 보이게 변경
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
        appendFurniture: (state, action) => {
            const newItem = action.payload;
            const exists = state.list.some(item => item.id === newItem.id);
            if (!exists) {
                state.list.push(newItem);
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

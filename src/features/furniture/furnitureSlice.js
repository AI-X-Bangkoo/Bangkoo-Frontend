import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [],
};

const furnitureSlice = createSlice({
    name: 'furniture',
    initialState,
    reducers: {
        addFurniture: (state, action) => {
            state.list.push(action.payload);
        },
        removeFurniture: (state, action) => {
            state.list = state.list.filter(item => item.id !== action.payload);
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
    },
});

export const { addFurniture, removeFurniture, toggleFurniture, setInitialFurniture } = furnitureSlice.actions;
export default furnitureSlice.reducer;
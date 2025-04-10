import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    checkedItems: {}, // key: item.id, value: true/false
};

const selectionSlice = createSlice({
    name: 'selection',
    initialState,
    reducers: {
        toggleItem(state, action) {
            const id = action.payload;
            state.checkedItems[id] = !state.checkedItems[id];
        },
        setItemChecked(state, action) {
            const { id, checked } = action.payload;
            state.checkedItems[id] = checked;
        },
        clearAllSelections(state) {
            state.checkedItems = {};
        },
    },
});

export const {
    toggleItem,
    setItemChecked,
    clearAllSelections
} = selectionSlice.actions;
export default selectionSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import furnitureReducer from '../features/furniture/furnitureSlice';
import recommendedReducer from "../features/furniture/recommendedSlice";
import interiorReducer from '../features/furniture/interiorSlice';

export const store = configureStore({
    reducer: {
        furniture: furnitureReducer,
        recommended: recommendedReducer,
        interior: interiorReducer,
    },
});

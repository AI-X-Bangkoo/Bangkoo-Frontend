import React from "react";
import { useSelector } from "react-redux";
import AIFurnitureList from "./AIFurnitureList";

export default function AIFurnitureTab({ onPlus }) {
    const furnitureList = useSelector((state) => state.recommended.list); // ✅ Redux에서 가져오기

    return <AIFurnitureList furnitureList={furnitureList} onPlus={onPlus} />;
}
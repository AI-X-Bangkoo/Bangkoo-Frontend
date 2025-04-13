import React from "react";
import { FurnitureGrid } from "./css/MyRoom.styled";
import CommonImageBox from "@/common/CommonImageBox";

function MyFurnitureList({ furnitureList = [], onPlus, onMinus }) {
    return (
        <FurnitureGrid>
            {furnitureList.map((item) => (
                <CommonImageBox
                    key={item.id}
                    image={item.image}
                    type={item.type}
                    onPlus={() => onPlus(item)}
                    onMinus={() => onMinus(item)}
                />
            ))}
        </FurnitureGrid>
    );
}

export default MyFurnitureList;

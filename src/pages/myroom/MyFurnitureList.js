import React from "react";
import { FurnitureGrid } from "./css/MyRoom.styled";
import CommonImageBox from "@/common/CommonImageBox";

function MyFurnitureList({ furnitureList = [], onPlusMinus }) {
    return (
        <FurnitureGrid>
            {furnitureList.map((item) => (
                <CommonImageBox
                    key={item.id}
                    image={item.image}
                    type={item.type}
                    onPlusMinus={() => onPlusMinus(item)}
                />
            ))}
        </FurnitureGrid>
    );
}

export default MyFurnitureList;

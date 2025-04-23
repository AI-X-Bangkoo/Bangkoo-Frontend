import React from "react";
import {FurnitureGrid, TextBox} from "./css/MyRoom.styled";
import CommonImageBox from "@/common/CommonImageBox";
import {Text} from "@/common/Typography";

function AIFurnitureList({ furnitureList = [], onPlus }) {
    return (
        <FurnitureGrid>
            {furnitureList.map((item) => (
                <TextBox key={item.id}>
                    <CommonImageBox
                        image={item.image}
                        type={item.type}
                        onPlus={() => onPlus(item)}
                    />
                    <Text size="xxs" $weight={800}>{item.title}</Text>
                    <Text size="12px" $weight={600}>{item.text}</Text>
                    <Text size="xxs" $weight={600}>₩ {item.price.toLocaleString()}</Text>
                </TextBox>


            ))}
        </FurnitureGrid>
    );
}

export default AIFurnitureList;

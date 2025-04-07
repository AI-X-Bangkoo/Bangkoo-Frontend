import React from "react";
import {FurnitureGrid, TextBox} from "./MyRoom.styled";
import CommonImageBox from "../../common/CommonImageBox";
import {Text} from "../../common/Typography";


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
                    <Text size="base" $weight={800}>{item.title}</Text>
                    <Text size="xs" $weight={600}>{item.text}</Text>
                    <Text size="xs" $weight={600}>₩ {item.price}</Text>
                </TextBox>


            ))}
        </FurnitureGrid>
    );
}

export default AIFurnitureList;

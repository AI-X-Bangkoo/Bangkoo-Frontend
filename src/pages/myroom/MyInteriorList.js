import React from "react";
import {FurnitureGrid, TextBox} from "./css/MyRoom.styled";
import CommonImageBox from "../../common/CommonImageBox";
import {Text} from "../../common/Typography";

function MyInteriorList({ interiorList = [], onDelete }) {
    return (
        <FurnitureGrid>
            {interiorList.map((item) => (
                <TextBox key={item.id}>
                    <CommonImageBox
                        image={item.image}
                        type={item.type}
                        showDelete={true}
                        onDelete={() => onDelete(item)}
                    />
                    <Text size="xxs" $weight={500}>{item.text}</Text>
                </TextBox>
            ))}
        </FurnitureGrid>
    );
}

export default MyInteriorList;

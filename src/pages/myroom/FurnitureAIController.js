import React from "react";
import {AIControllerBox} from "./MyRoom.styled";
import CommonButton from "../../common/CommonButton";

function FurnitureAIController() {

    return (
        <AIControllerBox>
            <CommonButton
                width="135px"
                height="44px"
                fontSize="xs"
                fontWeight="800"
                radius="sm"
                type="fill"
            >
                AI 추천 조건
            </CommonButton>
        </AIControllerBox>
    );
}

export default FurnitureAIController;
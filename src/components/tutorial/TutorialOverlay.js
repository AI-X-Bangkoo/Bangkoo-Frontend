import React from "react";
import {
    TooltipWrapper,
    TooltipBubble,
} from "./css/TutorialOverlay.styled";

function TutorialOverlay({ message, position, arrowDirection = "down", arrowLeft  }) {
    return (
        <TooltipWrapper $top={position.top} $left={position.left}>
            <TooltipBubble $direction={arrowDirection} $arrowLeft={arrowLeft}>
                {message}
            </TooltipBubble>


        </TooltipWrapper>
    );
}

export default TutorialOverlay;

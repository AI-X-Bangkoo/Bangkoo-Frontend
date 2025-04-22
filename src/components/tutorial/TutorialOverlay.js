import React from "react";
import {
    TooltipWrapper,
    TooltipBubble,
    ButtonBox,
} from "./css/TutorialOverlay.styled";




function TutorialOverlay({ message, position, onPrev, onNext }) {
    return (
        <TooltipWrapper $top={position.top} $left={position.left}>
            <TooltipBubble>
                {message}
            </TooltipBubble>


        </TooltipWrapper>
    );
}

export default TutorialOverlay;

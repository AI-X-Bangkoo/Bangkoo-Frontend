import React from "react";
import {StyledIconButton} from "./css/CommonStyle"

const CommonIconButton = ({width, height, icon, type, color, onClick}) => {
    return (
        <StyledIconButton
            width={width}
            height={height}
            type={type}
            color={color}
            onClick={onClick}
        >
            {icon}
        </StyledIconButton>
    )
}

export default CommonIconButton;
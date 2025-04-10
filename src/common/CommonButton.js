// common/CommonButton.js
import React from "react";
import {StyledButton} from "./css/Button.styled"

const CommonButton = ({
          children,
          width,
          height,
          bgColor,
          fontSize,
          fontWeight,
          borderRadius,
          color,
          type = "fill",
          onClick,
          ...rest
      }) => {
    return (
        <StyledButton
            width={width}
            height={height}
            $bgColor={bgColor}
            fontSize={fontSize}
            fontWeight={fontWeight}
            borderRadius={borderRadius}
            color={color}
            type={type}
            onClick={onClick}
            {...rest}
        >
            {children}
        </StyledButton>
    );
};

export default CommonButton;

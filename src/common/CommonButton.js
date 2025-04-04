import React from "react";
import {StyledButton} from "./css/CommonStyle"

const CommonButton = ({
          children,
          width,
          height,
          bg,
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
            bg={bg}
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

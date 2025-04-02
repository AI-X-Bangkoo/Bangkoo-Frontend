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
            {...rest}
        >
            {children}
        </StyledButton>
    );
};

export default CommonButton;

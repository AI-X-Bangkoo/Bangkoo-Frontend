import React from "react";
import { InputStyle } from "./css/CommonStyle";

const CommonTextField = ({
                             type = "text",
                             width,
                             height,
                             placeholder,
                             value,
                             onChange,
                             disabled,
                             name,
                             line,
                             custom,
                             fontSize,
                             onFocus,
                             onBlur
                         }) => {
    return (
        <InputStyle
            type={type}
            width={width}
            height={height}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            name={name}
            $line={line}
            $custom={custom}
            fontSize={fontSize}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    );
};

export default CommonTextField;
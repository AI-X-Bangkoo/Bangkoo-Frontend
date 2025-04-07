import React from "react";
import {InputWrapper, InputStyle, ClearAllButton, ClearAllBox} from "./css/CommonStyle";
import { ReactComponent as CloseIcon } from "../assets/images/CloseIcon.svg";
import CommonIconButton from "./CommonIconButton";

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
                             imagePreviewUrl,
                             onClearAll,
                         }) => {

    const handleKeyDown = (e) => {
        if (e.key === "Backspace" && value === "" && imagePreviewUrl && onClearAll) {
            onClearAll();
        }
    };

    const shouldShowClear = value !== "" || imagePreviewUrl;

    return (
        <InputWrapper width={width} height={height} $line={line} $custom={custom}>
            <InputStyle
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                name={name}


                fontSize={fontSize}
                onFocus={onFocus}
                onKeyDown={handleKeyDown}
            />
            {shouldShowClear && (
                <ClearAllBox onClick={onClearAll}>
                    <CommonIconButton
                        type="full"
                        width="20px"
                        height="20px"
                        icon={<CloseIcon />}
                    />
                </ClearAllBox>
            )}
        </InputWrapper>
    );
};

export default CommonTextField;
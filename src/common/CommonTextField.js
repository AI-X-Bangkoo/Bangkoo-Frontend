import React from "react";
import {InputWrapper, InputStyle, ClearAllBox} from "./css/TextField.styled";
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
                             onEnter,
                         }) => {

    const handleKeyDown = (e) => {
        // 1. 백스페이스 + 이미지 있는 경우 → 이미지 제거
        if (e.key === "Backspace" && value === "" && imagePreviewUrl && onClearAll) {
            onClearAll();
        }

        if (e.key === "Enter" && typeof onEnter === "function") {
            onEnter();
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
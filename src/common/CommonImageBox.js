import React from "react";
import {ImageBoxStyle, AiChip, BottomRightBox, CheckboxArea, CenterBox} from "./css/ImageBox.styled"
import CommonIconButton from "../common/CommonIconButton"
import { ReactComponent as AiIcon } from "../assets/images/AiIcon.svg";
import { ReactComponent as PlusIcon } from "../assets/images/PlusIcon.svg";
import { ReactComponent as MinusIcon } from "../assets/images/MinusIcon.svg";
import { ReactComponent as TrashIcon } from "../assets/images/TrashIcon.svg";
import { ReactComponent as CheckIcon } from "../assets/images/CheckIcon.svg";
import { ReactComponent as UnCheckIcon } from "../assets/images/UnCheckIcon.svg";

function CommonImageBox({
            image,
            type = "basic", // basic | hoverPlus | hoverMinus | aiPlus | removeButton | checkbox
            isChecked = false,
            showDelete = false,
            onLink,
            onPlus,
            onPlusMinus,
            onDelete,
            onCheck,
        }) {

    if (type === "basic" && onLink) {
        return (
            <a href={onLink} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                <ImageBoxStyle>
                    <img src={image} alt="가구 이미지" />
                </ImageBoxStyle>
            </a>
        );
    }

    const buttonProps = {
        width: "34px",
        height: "34px",
        type: "full",
    };

    return (
        <ImageBoxStyle >
            <img src={image} alt="가구 이미지" />

            {/* AI Chip */}
            {type === "aiPlus" && (
                <AiChip>
                    <AiIcon />
                    <span>AI</span>
                </AiChip>
            )}

            {type === "hoverPlus" && (
                <CenterBox>
                    <CommonIconButton
                        color="orange"
                        onClick={onPlusMinus}
                        icon={<PlusIcon />}
                        {...buttonProps}
                    />
                </CenterBox>
            )}

            {type === "hoverMinus" && (
                <CenterBox>
                    <CommonIconButton
                        color="red"
                        onClick={onPlusMinus}
                        icon={<MinusIcon />}
                        {...buttonProps}
                    />
                </CenterBox>
            )}

            {/* 하단 플러스 버튼 (aiPlus) */}
            {type === "aiPlus" && (
                <BottomRightBox>
                    <CommonIconButton onClick={onPlus} color="orange" icon={<PlusIcon />} {...buttonProps}/>
                </BottomRightBox>
            )}

            {/*/!* 삭제 버튼 (외부 제어) *!/*/}
            {type === "removeButton" && showDelete && (
                <BottomRightBox>
                    <CommonIconButton onClick={onDelete} color="red" icon={<TrashIcon />} {...buttonProps}/>
                </BottomRightBox>
            )}

            {/*/!* 체크박스 (type === checkbox) *!/*/}
            {type === "checkbox" && (
                <CheckboxArea onClick={onCheck}>
                    {isChecked ? <CheckIcon /> : <UnCheckIcon />}
                </CheckboxArea>
            )}

        </ImageBoxStyle>
    );
}

export default CommonImageBox;
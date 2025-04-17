// pages/myroom/FurnitureController.js

import React from "react";
import {ControllerBox, FlexBox} from "./css/MyRoom.styled";
import CommonButton from "@/common/CommonButton";
import { useApplyPlacement } from "@/hooks/useApplyPlacement";

function FurnitureController({saveClick, aiClick}) {

    const background = null;    // TODO: 실제 배경으로 교체
    const reference = null;     // TODO: 필요시 참조 이미지로
    const canvasSize = {width: 1024, height: 720} ;

    const applyPlacement = useApplyPlacement({
        mode: "default", // 기본 동작 막아두기
        background: background,
        reference: reference,
        canvasSize: canvasSize,
        setShowMask: () => {},
        setShowHelper: () => {},
    });

    const handlePlacementClick = () => {
        applyPlacement();
    }

    const buttonProps = {
        height: "44px",
        fontSize: "xs",
        fontWeight: 800,
        radius: "sm",
    };

    return (
        <ControllerBox>
            <CommonButton
                width="135px"
                type="fill"
                {...buttonProps}
            >
                튜토리얼
            </CommonButton>

            <FlexBox>
                <CommonButton
                    width="135px"
                    type="outline"
                    {...buttonProps}
                >
                    초기 이미지
                </CommonButton>
                <CommonButton
                    width="135px"
                    type="outline"
                    onClick={handlePlacementClick} // mode 값을 상태에서 전달받고 useApplyPlacement() 실행
                    {...buttonProps}
                >
                    배치 결과 보기  
                </CommonButton>
                <CommonButton
                    width="80px"
                    type="outline"
                    onClick={saveClick}
                    {...buttonProps}
                >
                    저장
                </CommonButton>
            </FlexBox>
        </ControllerBox>
    );
}

export default FurnitureController;
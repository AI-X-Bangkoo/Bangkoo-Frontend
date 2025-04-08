import React from "react";
import {ControllerBox, FlexBox} from "./MyRoom.styled";
import CommonButton from "../../common/CommonButton";

function MyRoom({saveClick, aiClick}) {

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
                    onClick={aiClick}
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

export default MyRoom;
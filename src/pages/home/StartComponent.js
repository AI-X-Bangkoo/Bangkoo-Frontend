import React from "react";
import {StartRoot} from "./Home.styled"
import CommonButton from '../../common/CommonButton';

function StartComponent() {
    return (
        <StartRoot>
            <CommonButton
                width="220px"
                height="50px"
                fontSize="base"
                fontWeight={900}
                radius="full"
                type="fill"
            >
                지금 시작하기
            </CommonButton>
        </StartRoot>
    );
}
export default StartComponent;
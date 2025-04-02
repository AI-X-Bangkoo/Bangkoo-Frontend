import React from "react";
import {HomeRoot, HomeTextStyle} from "./Home.styled"
import CommonButton from '../../common/CommonButton';

function Banner() {
    return (
        <HomeRoot>
            <HomeTextStyle>
                <span>가구</span>를 옮기고, 지우고, 추천까지!<br/>
                당신의 <span>공간</span>을 <span>AI</span>와 함께<br/>
                새롭게 바꿔보세요
            </HomeTextStyle>
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

        </HomeRoot>
    )
}

export default Banner;
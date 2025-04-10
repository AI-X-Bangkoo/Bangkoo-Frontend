import React from "react";
import {StartRoot} from "./css/Home.styled"
import CommonButton from '@/common/CommonButton';
import {useNavigate} from "react-router-dom";

function StartComponent() {
    const navigate = useNavigate();

    const goToRoom = () => {
        navigate("/myroom"); // 홈 화면으로 리다이렉트
    };

    return (
        <StartRoot>
            <CommonButton
                width="220px"
                height="50px"
                fontSize="base"
                fontWeight={900}
                radius="full"
                type="fill"
                onClick={goToRoom}
            >
                지금 시작하기
            </CommonButton>
        </StartRoot>
    );
}
export default StartComponent;
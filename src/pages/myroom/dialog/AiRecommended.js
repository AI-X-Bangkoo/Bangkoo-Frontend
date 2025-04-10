import React, {useState, useEffect} from "react";
import {
    AiRecommendedRoot,
    FurnitureImageStyled,
    ImageWrapper, ProgressBarWrapper, ProgressInner, ProgressOuter,
    StyledSlider,
} from "./css/AiRecommended.styled";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Text} from "../../../common/Typography";
import { useDispatch, useSelector } from "react-redux";
import { startAnalysis, endAnalysis } from "../../../features/ai/aiSlice";

import TestImage from "../../../assets/images/TestImage.png";

function AiRecommended() {
    const dispatch = useDispatch();
    const isAnalyzing = useSelector((state) => state.ai.isAnalyzing);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        dispatch(startAnalysis()); // 분석 시작 상태로 진입

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + 5;
                if (next >= 100) {
                    clearInterval(timer);
                    dispatch(endAnalysis()); // 분석 종료
                    return 100;
                }
                return next;
            });
        }, 500);

        return () => clearInterval(timer);

    }, [dispatch]);

    const sliderSettings = {
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 3.5,
        slidesToScroll: 1,
        autoplay: true,
        speed: 4000,
        autoplaySpeed: 0,
        cssEase: "linear",
        pauseOnHover: false,
    };

    const images = Array.from({ length: 10 }).map((_, i) => (
        <ImageWrapper key={i}>
            <FurnitureImageStyled src={TestImage} alt={`가구 ${i + 1}`} />
        </ImageWrapper>
    ));

    return (
        <AiRecommendedRoot>
            <Text size="md" $weight={700}>
                “당신의 <span>공간</span>을 더 아름답게, <span>AI</span>가 어울리는 <span>가구</span>를 골라드려요”
            </Text>

            <StyledSlider {...sliderSettings}>{images}</StyledSlider>

            <ProgressBarWrapper>
                <Text size="xxs" $weight={500}>
                    배치 결과 보기까지 <span>{progress}%</span> 진행중
                </Text>
                <ProgressOuter>
                    <ProgressInner $percent={progress} />
                </ProgressOuter>
            </ProgressBarWrapper>
        </AiRecommendedRoot>
    )
}

export default AiRecommended;
import React from "react";
import {BannerRoot, BannerText} from "./Home.styled"
import SearchComponent from "../search/SearchComponent"

function Banner() {
    return (
        <BannerRoot>
            <BannerText>
                <span>가구</span>를 옮기고, 지우고, 추천까지!<br/>
                당신의 <span>공간</span>을 <span>AI</span>와 함께<br/>
                새롭게 바꿔보세요
            </BannerText>

            <SearchComponent />

        </BannerRoot>
    )
}

export default Banner;
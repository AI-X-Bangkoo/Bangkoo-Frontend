import React, {useState} from "react";
import {BannerRoot, BannerText} from "./Home.styled"
import SearchComponent from "../search/SearchComponent"
import SearchExplanation from "../search/SearchExplanation"

function Banner() {
    const [isHover, setIsHover] = useState(false);

    return (
        <BannerRoot>
            <BannerText>
                <span>가구</span>를 옮기고, 지우고, 추천까지!<br/>
                당신의 <span>공간</span>을 <span>AI</span>와 함께<br/>
                새롭게 바꿔보세요
            </BannerText>

            {/* 검색창 */}
            <div>
                <div
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    <SearchComponent shadow={true}/>
                </div>
                {/* 검색창 마우스 hover시 */}
                <SearchExplanation visible={isHover}/>

            </div>

        </BannerRoot>
    )
}

export default Banner;
import React, {useState, useEffect, useRef} from "react";
import {BannerRoot, BannerText} from "./Home.styled"
import SearchComponent from "../search/SearchComponent"
import SearchExplanation from "../search/SearchExplanation"
import SearchTerm from "../search/SearchTerm"

function Banner() {
    const [isHover, setIsHover] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const containerRef = useRef(null); // 전체 검색 영역 감싸는 div

    useEffect(() => {
        function handleClickOutside(event) {
            // SearchComponent, SearchTerm 바깥 클릭 시
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <BannerRoot>
            <BannerText>
                <span>가구</span>를 옮기고, 지우고, 추천까지!<br/>
                당신의 <span>공간</span>을 <span>AI</span>와 함께<br/>
                새롭게 바꿔보세요
            </BannerText>

            {/* 검색창 */}
            <div ref={containerRef}>
                <div
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    <SearchComponent
                        shadow={true}
                        onFocus={() => setIsFocused(true)}
                    />
                </div>
                {/* 검색창 마우스 hover시 */}
                <SearchExplanation visible={isHover}/>
                {/* 검색창 클릭시 */}
                {isFocused && <SearchTerm />}

            </div>

        </BannerRoot>
    )
}

export default Banner;
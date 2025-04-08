import React, {useEffect, useRef, useState} from "react";
import SearchInputComponent from "./SearchInputComponent";
import SearchExplanation from "./SearchExplanation";
import SearchTerm from "./SearchTerm";
import Category from "./Category";

function AISearchComponent() {
    const [isHover, setIsHover] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [category, setCategory] = useState(false);

    const containerRef = useRef(null); // 전체 검색 영역 감싸는 div

    const handleClickCategory = () => {
        setCategory(!category);
        setIsHover(false);
        setIsFocused(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            // SearchComponent, SearchTerm 바깥 클릭 시
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsFocused(false);
            }

            setCategory(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} style={{position: 'relative', zIndex: 10}}>
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <SearchInputComponent
                    shadow={true}
                    onFocus={() => setIsFocused(true)}
                    handleClickCategory={handleClickCategory}
                />
            </div>
            {/* 검색창 마우스 hover시 */}
            <SearchExplanation visible={isHover}/>
            {/* 검색창 클릭시 */}
            {isFocused && <SearchTerm />}
            {/* 카테고리 */}
            {category && <Category/>}
        </div>
    );
}

export default AISearchComponent;
import React, {useEffect, useRef, useState} from "react";
import SearchInputComponent from "./SearchInputComponent";
import SearchExplanation from "./SearchExplanation";
import SearchTerm from "./SearchTerm";
import Category from "./Category";
import ImageSearchBox from "./ImageSearchBox";

function AISearchComponent() {
    const [isHover, setIsHover] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [category, setCategory] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [showImageSearchBox, setShowImageSearchBox] = useState(false);

    const containerRef = useRef(null); // 전체 검색 영역 감싸는 div

    const handleClickCategory = () => {
        setCategory(!category);
        setIsHover(false);
        setIsFocused(false);
        setShowImageSearchBox(false)
    };

    const handleClickIsFocused = () => {
        setIsFocused(true);
        setIsHover(false);
        setShowImageSearchBox(false);
        setCategory(false)
    };

    const handleClickImageSearch = () => {
        setShowImageSearchBox(!showImageSearchBox);
        setIsHover(false);
        setIsFocused(false);
        setCategory(false)
    };

    useEffect(() => {
        function handleClickOutside(event) {
            // SearchComponent, SearchTerm 바깥 클릭 시
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsFocused(false);
                setCategory(false);
                setShowImageSearchBox(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClearImage = () => {
        setUploadedImage(null); // 이미지 미리보기 제거
    };

    return (
        <div ref={containerRef} style={{position: 'relative', zIndex: 10}}>
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <SearchInputComponent
                    shadow={true}
                    onFocus={handleClickIsFocused}
                    handleClickCategory={handleClickCategory}
                    onClickImage={handleClickImageSearch}
                    imagePreviewUrl={uploadedImage}
                    onClearImage={handleClearImage}
                />
            </div>

            {/* 검색창 마우스 hover시 */}
            <SearchExplanation visible={isHover}/>
            {/* 검색창 클릭시 */}
            {isFocused && <SearchTerm />}
            {/* 카테고리 */}
            {category && <Category/>}

            {/* 이미지 검색 */}
            {showImageSearchBox && (
                <ImageSearchBox onSearchComplete={(imageUrl) => {
                    setUploadedImage(imageUrl);
                    setShowImageSearchBox(false);

                }} />
            )}
        </div>
    );
}

export default AISearchComponent;
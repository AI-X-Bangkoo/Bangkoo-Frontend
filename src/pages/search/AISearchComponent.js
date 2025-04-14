import React, {useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUploadedImage, setSearchResults, setConfirmedKeyword, setKeyword } from "@/features/search/searchSlice";
import SearchInputComponent from "./SearchInputComponent";
import SearchExplanation from "./SearchExplanation";
import SearchTerm from "./SearchTerm";
import Category from "./Category";
import ImageSearchBox from "./ImageSearchBox";
import { useNavigate } from "react-router-dom";
import { searchByImage } from "@/api/search/search";
import useSearchHistory from "@/hooks/search/useSearchHistory";

function AISearchComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addKeyword } = useSearchHistory();
    const uploadedImage = useSelector((state) => state.search.uploadedImage); // 전역 상태

    const [isHover, setIsHover] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [category, setCategory] = useState(false);
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

    // 카테고리 클릭시 검색
    const handleSearchByCategory = async (categoryName) => {
        try {
            const trimmed = categoryName.trim();
            if (!trimmed) return;

            dispatch(setKeyword(trimmed));
            addKeyword(trimmed);

            const formData = new FormData();
            formData.append("query", trimmed);

            const result = await searchByImage(formData);

            dispatch(setSearchResults(result));
            dispatch(setConfirmedKeyword(trimmed));
            dispatch(setKeyword(""));
            dispatch(setUploadedImage(null));

            setCategory(false);
            setIsFocused(false);
            setShowImageSearchBox(false);

            navigate("/search");
        } catch (err) {
            console.error("카테고리 검색 실패:", err);
        }
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
        dispatch(setUploadedImage(null)); // Redux 상태 초기화
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
                    imagePreviewUrl={uploadedImage} // Redux 상태 전달
                    onClearImage={handleClearImage}
                    setSearchResults={setSearchResults}
                    onCloseSearchTerm={() => setIsFocused(false)} // 최근 검색어 닫기
                />
            </div>

            {/* 검색창 마우스 hover시 */}
            <SearchExplanation visible={isHover}/>
            {/* 검색창 클릭시 */}
            {isFocused && <SearchTerm onClose={() => setIsFocused(false)} />}
            {/* 카테고리 */}
            {category && <Category onSearch={handleSearchByCategory} />}

            {/* 이미지 검색 */}
            {showImageSearchBox && (
                <ImageSearchBox
                    onSearchComplete={(imageUrl) => {
                        dispatch(setUploadedImage(imageUrl)); // Redux로 이미지 저장
                        setShowImageSearchBox(false);
                    }}
                />
            )}
        </div>
    );
}

export default AISearchComponent;
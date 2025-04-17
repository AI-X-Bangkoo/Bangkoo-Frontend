import React, {useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUploadedImage, setSearchResults, setConfirmedKeyword, setKeyword } from "@/features/search/searchSlice";
import SearchInputComponent from "./SearchInputComponent";
import SearchExplanation from "./SearchExplanation";
import SearchTerm from "./SearchTerm";
import Category from "./Category";
import ImageSearchBox from "./ImageSearchBox";
import { useNavigate } from "react-router-dom";
import { searchByText } from "@/api/search/search";
import useSearchHistory from "@/hooks/search/useSearchHistory";
import useAuth from "@/hooks/login/useAuth";
import { setLoading } from "@/features/search/searchSlice";

function AISearchComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addKeyword } = useSearchHistory();
    const { user } = useAuth();
    const userId = user?.userId;

    const [isHover, setIsHover] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [category, setCategory] = useState(false);
    const [showImageSearchBox, setShowImageSearchBox] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);

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

            dispatch(setLoading(true));
            dispatch(setKeyword(trimmed));

            const finalUserId = userId ? userId : "anonymous";

            navigate(`/search?query=${encodeURIComponent(trimmed)}`);

            setCategory(false);
            setIsFocused(false);
            setShowImageSearchBox(false);

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
        dispatch(setUploadedImage(null));
        setImagePreviewUrl("");
        setImageFile(null);
    };

    const handleImageSearchComplete = (data) => {
        if (typeof data === "string") {
            dispatch(setUploadedImage(data));
            setImagePreviewUrl(data);
            setImageFile(null);
        } else if (typeof data === "object" && data.previewUrl && data.imageFile) {
            dispatch(setUploadedImage(data.previewUrl));
            setImagePreviewUrl(data.previewUrl);
            setImageFile(data.imageFile);
        }
        setShowImageSearchBox(false);
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
                    imagePreviewUrl={imagePreviewUrl}
                    imageFile={imageFile}
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
            {category && <Category onSearch={handleSearchByCategory} setCategory={setCategory} />}

            {/* 이미지 검색 */}
            {showImageSearchBox && (
                <ImageSearchBox
                    onSearchComplete={handleImageSearchComplete}
                />
            )}
        </div>
    );
}

export default AISearchComponent;
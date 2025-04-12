import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUploadedImage, setSearchResults, setConfirmedKeyword } from "@/features/search/searchSlice";
import {SearchRoot, PreviewImage, InputBox} from "./css/SearchInput.styled"
import CommonIconButton from "@/common/CommonIconButton";
import { ReactComponent as VoiceIcon } from "@/assets/images/VoiceIcon.svg";
import { ReactComponent as SearchIcon } from "@/assets/images/SearchIcon.svg";
import { ReactComponent as MenuIcon } from "@/assets/images/MenuIcon.svg";
import { ReactComponent as ImageIcon } from "@/assets/images/ImageIcon.svg";
import CommonTextField from "@/common/CommonTextField";
import useSearchHistory from "@/hooks/search/useSearchHistory";
import { searchByText } from "../../api/search/search";

const SearchInputComponent = ({
                                  shadow,
                                  border,
                                  onFocus,
                                  handleClickCategory,
                                  onClickImage,
                                  imagePreviewUrl,
                                  onClearImage,
                                  onCloseSearchTerm
        }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { keyword, updateKeyword, addKeyword } = useSearchHistory();
    const text = useSelector((state) => state.search.keyword); // Redux 상태 사용

    const handleTextChange = (e) => {
        updateKeyword(e.target.value); // 상태 변경
    };

    const handleClearAll = () => {
        updateKeyword("");
        dispatch(setUploadedImage(null));
        if (typeof onClearImage === "function") onClearImage();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();            // 폼 제출 방지
            goToSearch();                  // 검색 실행
            if (typeof onFocus === "function") {
                onCloseSearchTerm();              // 최근 검색창 닫기!
            }
        }
    };

    const goToSearch = async () => {
        if (text.trim() !== "") {
            addKeyword(keyword); // 검색 히스토리 저장
            try {
                const result = await searchByText(text); // 텍스트 검색 API 호출
                // console.log("검색 결과:", result);
                dispatch(setSearchResults(result)); // Redux에 검색 결과 저장
                dispatch(setConfirmedKeyword(text));
                navigate("/search");
            } catch (error) {
                console.error("검색 실패:", error);
            }
        }
    };

    return (
        <SearchRoot $shadow={shadow} $border={border}>
            <CommonIconButton type={"none"} icon={<MenuIcon/>} onClick={handleClickCategory} />
            {imagePreviewUrl &&
                <PreviewImage src={imagePreviewUrl} alt="Preview" />
            }
            <InputBox>
                <CommonTextField
                    fontSize="base"
                    placeholder="ex) 빨간색 모던한 의자"
                    value={text}
                    onChange={handleTextChange}
                    onFocus={onFocus}
                    imagePreviewUrl={imagePreviewUrl}
                    onClearAll={handleClearAll}
                    onKeyDown={handleKeyDown}
                />
            </InputBox>

            <CommonIconButton type={"none"} icon={<ImageIcon/>} onClick={onClickImage}></CommonIconButton>
            <CommonIconButton type={"none"} icon={<VoiceIcon/>}></CommonIconButton>
            <CommonIconButton onClick={goToSearch} type={"none"} icon={<SearchIcon/>}></CommonIconButton>
        </SearchRoot>
    )
}

export default SearchInputComponent;
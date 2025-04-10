import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setKeyword, setUploadedImage, addRecentKeyword } from "../../features/search/searchSlice";

import {SearchRoot, PreviewImage, InputBox} from "./SearchInput.styled"
import CommonIconButton from "../../common/CommonIconButton";
import { ReactComponent as VoiceIcon } from "../../assets/images/VoiceIcon.svg";
import { ReactComponent as SearchIcon } from "../../assets/images/SearchIcon.svg";
import { ReactComponent as MenuIcon } from "../../assets/images/MenuIcon.svg";
import { ReactComponent as ImageIcon } from "../../assets/images/ImageIcon.svg";
import CommonTextField from "../../common/CommonTextField";
import {useNavigate} from "react-router-dom";

const SearchInputComponent = ({
                                  shadow,
                                  border,
                                  onFocus,
                                  handleClickCategory,
                                  onClickImage,
                                  imagePreviewUrl,
                                  onClearImage
        }) => {

    const dispatch = useDispatch();
    const text = useSelector((state) => state.search.keyword); // Redux 상태 사용

    const navigate = useNavigate();

    const handleTextChange = (e) => {
        dispatch(setKeyword(e.target.value)); // 상태 변경
    };

    const goToSearch = () => {
        if (text.trim() !== "") {
            dispatch(addRecentKeyword(text)); // 검색 히스토리 저장
        }
        navigate("/search"); // 홈 화면으로 리다이렉트
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
                    onClearAll={() => {
                        dispatch(setKeyword(""));               // 텍스트 초기화
                        dispatch(setUploadedImage(null));       // 이미지도 함께 초기화
                        if (typeof onClearImage === "function") onClearImage();
                    }}
                />
            </InputBox>

            <CommonIconButton type={"none"} icon={<ImageIcon/>} onClick={onClickImage}></CommonIconButton>
            <CommonIconButton type={"none"} icon={<VoiceIcon/>}></CommonIconButton>
            <CommonIconButton onClick={goToSearch} type={"none"} icon={<SearchIcon/>}></CommonIconButton>
        </SearchRoot>
    )
}

export default SearchInputComponent;
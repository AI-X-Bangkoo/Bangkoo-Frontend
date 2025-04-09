import React, {useState} from "react";
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

    const [text, setText] = useState("");

    const navigate = useNavigate();

    const goToSearch = () => {
        navigate("/search"); // 홈 화면으로 리다이렉트
    };

    return (
        <SearchRoot $shadow={shadow} $border={border}>
            <CommonIconButton type={"none"} icon={<MenuIcon/>} onClick={handleClickCategory}></CommonIconButton>
            {imagePreviewUrl &&
                <PreviewImage src={imagePreviewUrl} alt="Preview" />
            }
            <InputBox>
                <CommonTextField
                    fontSize="base"
                    placeholder={ "ex) 빨간색 모던한 의자"}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={onFocus}
                    imagePreviewUrl={imagePreviewUrl}
                    onClearAll={() => {
                        setText("");
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
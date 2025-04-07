import React from "react";
import {SearchRoot} from "./SearchInput.styled"
import CommonIconButton from "../../common/CommonIconButton";
import { ReactComponent as VoiceIcon } from "../../assets/images/VoiceIcon.svg";
import { ReactComponent as SearchIcon } from "../../assets/images/SearchIcon.svg";
import { ReactComponent as MenuIcon } from "../../assets/images/MenuIcon.svg";
import { ReactComponent as ImageIcon } from "../../assets/images/ImageIcon.svg";
import CommonTextField from "../../common/CommonTextField";

const SearchInputComponent = ({shadow, border, onFocus, handleClickCategory}) => {

    return (
        <SearchRoot $shadow={shadow} $border={border}>
            <CommonIconButton type={"none"} icon={<MenuIcon/>} onClick={handleClickCategory}></CommonIconButton>
            <CommonTextField
                fontSize="base"
                placeholder={ "ex) 빨간색 모던한 의자"}
                onFocus={onFocus}
            />
            <CommonIconButton type={"none"} icon={<ImageIcon/>}></CommonIconButton>
            <CommonIconButton type={"none"} icon={<VoiceIcon/>}></CommonIconButton>
            <CommonIconButton type={"none"} icon={<SearchIcon/>}></CommonIconButton>
        </SearchRoot>
    )
}

export default SearchInputComponent;
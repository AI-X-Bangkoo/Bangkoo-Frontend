import React, {useState} from "react";
import {SearchRoot} from "./Search.styled"
import CommonIconButton from "../../common/CommonIconButton";
import { ReactComponent as VoiceIcon } from "../../assets/images/VoiceIcon.svg";
import { ReactComponent as SearchIcon } from "../../assets/images/SearchIcon.svg";
import { ReactComponent as MenuIcon } from "../../assets/images/MenuIcon.svg";
import CommonTextField from "../../common/CommonTextField";

const SearchComponent = ({shadow, border, onFocus}) => {

    return (
        <SearchRoot $shadow={shadow} $border={border}>
            <CommonIconButton type={"none"} icon={<MenuIcon/>}></CommonIconButton>
            <CommonTextField
                fontSize="base"
                placeholder={ "ex) 빨간색 모던한 의자"}
                onFocus={onFocus}
            />
            <CommonIconButton type={"none"} icon={<VoiceIcon/>}></CommonIconButton>
            <CommonIconButton type={"none"} icon={<SearchIcon/>}></CommonIconButton>
        </SearchRoot>
    )
}

export default SearchComponent;
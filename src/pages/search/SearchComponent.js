import React, {useState} from "react";
import {SearchRoot} from "./Search.styled"
import CommonIconButton from "../../common/CommonIconButton";
import { ReactComponent as VoiceIcon } from "../../assets/images/VoiceIcon.svg";
import { ReactComponent as SearchIcon } from "../../assets/images/SearchIcon.svg";
import { ReactComponent as MenuIcon } from "../../assets/images/MenuIcon.svg";
import CommonSwitch from "../../common/CommonSwitch";
import CommonTextField from "../../common/CommonTextField";

const SearchComponent = () => {

    return (
        <SearchRoot>
            <CommonIconButton type={"none"} icon={<MenuIcon/>}></CommonIconButton>
            <CommonSwitch />
            <CommonTextField placeholder={"가구를 검색하세요."} />
            <CommonIconButton type={"none"} icon={<VoiceIcon/>}></CommonIconButton>
            <CommonIconButton type={"none"} icon={<SearchIcon/>}></CommonIconButton>
        </SearchRoot>
    )
}

export default SearchComponent;
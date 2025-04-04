import React, {useState} from "react";
import {SearchRoot} from "./Search.styled"
import CommonIconButton from "../../common/CommonIconButton";
import { ReactComponent as VoiceIcon } from "../../assets/images/VoiceIcon.svg";
import { ReactComponent as SearchIcon } from "../../assets/images/SearchIcon.svg";
import { ReactComponent as MenuIcon } from "../../assets/images/MenuIcon.svg";
import CommonSwitch from "../../common/CommonSwitch";
import CommonTextField from "../../common/CommonTextField";

const SearchComponent = ({shadow, border}) => {
    const [checked, setChecked] = useState(false);

    return (
        <SearchRoot $shadow={shadow} $border={border}>
            <CommonIconButton type={"none"} icon={<MenuIcon/>}></CommonIconButton>
            <CommonSwitch checked={checked} setChecked={setChecked}/>
            <CommonTextField placeholder={checked ? "문장으로 검색하세요." : "가구를 검색하세요."} fontSize="base"/>
            <CommonIconButton type={"none"} icon={<VoiceIcon/>}></CommonIconButton>
            <CommonIconButton type={"none"} icon={<SearchIcon/>}></CommonIconButton>
        </SearchRoot>
    )
}

export default SearchComponent;
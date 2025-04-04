import React from "react";
import { SearchTermBox, RecentBox, PopularityBox, RecentTitleBox, RecentTextBox } from "./Search.styled";
import { Text } from "../../common/Typography";
import CommonIconButton from "../../common/CommonIconButton"
import { ReactComponent as CloseIcon } from "../../assets/images/CloseIcon.svg";

function SearchTerm({}) {
    const items = [
        {value: "빨간색 원형 탁자"},
        {value: "북유럽 스타일의 침대 북유럽 스타일의 침대 북유럽 스타일의 북유럽 스타일의 침대 북유럽 스타일의 침대"},
        {value: "컴퓨터 의자"},
    ]

    return (
        <SearchTermBox>
            <RecentBox>
                <RecentTitleBox>
                    <Text size="sm" $weight={800}>최근 검색어</Text>
                    <Text size="xxs" $weight={600} color="grey">전체 삭제</Text>
                </RecentTitleBox>

                {items.map((item, index) => (
                    <RecentTextBox key={index}>
                        <Text size="xs" $weight={500}>{item.value}</Text>
                        <CommonIconButton width="20px" height="20px" type="full" color="orange" icon={<CloseIcon/>} />
                    </RecentTextBox>
                ))}

            </RecentBox>

            <PopularityBox>
                <Text size="sm" $weight={800}>인기 검색어</Text>
            </PopularityBox>
        </SearchTermBox>
    );
}

export default SearchTerm;

import React from "react";
import {
    SearchTermBox,
    RecentBox,
    PopularityBox,
    RecentTitleBox,
    RecentTextBox,
    RecentBottomBox,
    SearchScrollBox, KeywordBox,
} from "./SearchInput.styled";
import { Text } from "../../common/Typography";
import CommonIconButton from "../../common/CommonIconButton"
import { ReactComponent as CloseIcon } from "../../assets/images/CloseIcon.svg";
import CommonButton from "../../common/CommonButton";

function SearchTerm() {
    const items = [
        {id: 1, value: "빨간색 원형 탁자"},
        {id: 2, value: "북유럽 스타일의 침대 북유럽 스타일의 침대 북유럽 스타일의 북유럽 스타일의 침대 북유럽 스타일의 침대"},
        {id: 3, value: "컴퓨터 의자"},
    ]

    const keyword = [
        {id: 1, value: "의자"},
        {id: 2, value: "침대"},
        {id: 3, value: "책상"},
        {id: 4, value: "쇼파"},
    ]

    return (
        <SearchTermBox>
            <RecentBox>
                <RecentTitleBox>
                    <Text size="sm" $weight={800}>최근 검색어</Text>
                    <Text size="xxs" $weight={600} color="grey">전체 삭제</Text>
                </RecentTitleBox>

                <SearchScrollBox>
                    {items?.map((item) => (
                        <RecentTextBox key={item.id}>
                            <Text size="xs" $weight={500}>{item.value}</Text>
                            <CommonIconButton width="20px" height="20px" type="full" color="orange" icon={<CloseIcon/>} />
                        </RecentTextBox>
                    ))}
                </SearchScrollBox>


                <RecentBottomBox>
                    <Text size="xxs" $weight={600}>자동저장 끄기</Text>
                </RecentBottomBox>

            </RecentBox>

            <PopularityBox>
                <Text size="sm" $weight={800}>인기 검색어</Text>
                <KeywordBox>
                    {keyword?.map((item) => (
                        <CommonButton
                            key={item.id}
                            width="90px"
                            height="30px"
                            fontSize="xxs"
                            fontWeight={900}
                            radius="full"
                            type="outline"
                        >
                            {item.value}
                        </CommonButton>
                    ))}
                </KeywordBox>
            </PopularityBox>
        </SearchTermBox>
    );
}

export default SearchTerm;

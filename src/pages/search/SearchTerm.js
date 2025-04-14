import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setSearchResults,
    setConfirmedKeyword,
    setKeyword,
    removeRecentKeyword,
    setUploadedImage,
} from "@/features/search/searchSlice";
import {
    SearchTermBox,
    RecentBox,
    PopularityBox,
    RecentTitleBox,
    RecentTextBox,
    RecentBottomBox,
    SearchScrollBox, KeywordBox,
} from "./css/SearchInput.styled";
import { Text } from "@/common/Typography";
import CommonIconButton from "@/common/CommonIconButton"
import { ReactComponent as CloseIcon } from "@/assets/images/CloseIcon.svg";
import CommonButton from "@/common/CommonButton";
import useSearchHistory from "@/hooks/search/useSearchHistory";
import { useNavigate } from "react-router-dom";
import { searchByImage } from "@/api/search/search";

function SearchTerm({onClose}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const recentKeywords = useSelector((state) => state.search.recentKeywords);
    const { autoSave, toggleAuto, clearAll, addKeyword } = useSearchHistory();

    const popularKeywords = [
        {id: 1, value: "의자"},
        {id: 2, value: "침대"},
        {id: 3, value: "책상"},
        {id: 4, value: "쇼파"},
    ]

    const handleSearch = async (keyword) => {
        try {
            const trimmed = keyword.trim();
            if (!trimmed) return;

            dispatch(setKeyword(trimmed));           // input에 키워드 반영
            addKeyword(trimmed);                     // 최근 검색어 추가

            const formData = new FormData();
            formData.append("query", trimmed);

            const result = await searchByImage(formData);
            dispatch(setSearchResults(result));
            dispatch(setConfirmedKeyword(trimmed));
            dispatch(setUploadedImage(null));
            dispatch(setKeyword(""));                // 검색 완료 후 input 초기화

            if (onClose) onClose();
            navigate("/search");
        } catch (err) {
            console.error("검색 실패:", err);
        }
    };

    return (
        <SearchTermBox>
            <RecentBox>
                <RecentTitleBox>
                    <Text size="sm" $weight={800}>최근 검색어</Text>
                    <Text
                        size="xxs"
                        onClick={clearAll}
                        $weight={600}
                        color="grey"
                        style={{ cursor: 'pointer' }}
                    >
                        전체 삭제
                    </Text>
                </RecentTitleBox>

                <SearchScrollBox>
                    {recentKeywords.map((item) => (
                        <RecentTextBox key={item}>
                            <Text
                                size="xs"
                                $weight={500}
                                onClick={() => handleSearch(item)}
                                style={{ cursor: 'pointer' }}

                            >
                                {item}
                            </Text>
                            <CommonIconButton
                                width="20px"
                                height="20px"
                                type="full"
                                color="orange"
                                icon={<CloseIcon/>}
                                onClick={() => dispatch(removeRecentKeyword(item))}
                            />
                        </RecentTextBox>
                    ))}
                </SearchScrollBox>


                <RecentBottomBox >
                    <Text
                        onClick={toggleAuto}
                        size="xxs"
                        $weight={600}
                    >
                        자동저장 {autoSave ? '끄기' : '켜기'}
                    </Text>
                </RecentBottomBox>

            </RecentBox>

            <PopularityBox>
                <Text size="sm" $weight={800}>인기 검색어</Text>
                <KeywordBox>
                    {popularKeywords.map((item) => (
                        <CommonButton
                            key={item.id}
                            width="90px"
                            height="30px"
                            fontSize="xxs"
                            fontWeight={900}
                            radius="full"
                            type="outline"
                            onClick={() => handleSearch(item.value)}
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

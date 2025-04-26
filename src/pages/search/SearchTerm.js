import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setConfirmedKeyword,
    setUploadedImage,
    removeRecentKeyword,
    clearRecentKeywords,
} from "@/features/search/searchSlice";
import {
    SearchTermBox,
    RecentBox,
    PopularityBox,
    RecentTitleBox,
    RecentTextBox,
    RecentBottomBox,
    SearchScrollBox,
    KeywordBox, AutoSaveBox,
} from "./css/SearchInput.styled";
import { Text } from "@/common/Typography";
import CommonIconButton from "@/common/CommonIconButton"
import { ReactComponent as CloseIcon } from "@/assets/images/CloseIcon.svg";
import CommonButton from "@/common/CommonButton";
import useSearchHistory from "@/hooks/search/useSearchHistory";
import useAuth from "@/hooks/login/useAuth";
import { getAnonymousId } from "@/features/search/generateAnonymousId";

import {
    fetchRecentSearches,
    deleteSearchItem,
    deleteAllSearchLogs,
    fetchPopularSearches
} from "@/api/search/search";

function SearchTerm({onClose, onSearch, setInputValue}) {
    const dispatch = useDispatch();
    const { autoSave, toggleAuto } = useSearchHistory();
    const { user, isLoggedIn } = useAuth();
    const userId = isLoggedIn ? user?.userId : getAnonymousId();

    const [recentKeywords, setRecentKeywords] = useState([]);
    const [popularKeywords, setPopularKeywords] = useState([]);
    
    // 검색 실행
    const handleSearch = async (keyword) => {
        const trimmed = keyword.trim();
        if (!trimmed) return;

        dispatch(setConfirmedKeyword(trimmed));
        dispatch(setUploadedImage(null));

        if (typeof setInputValue === "function") {
            setInputValue(trimmed);
        }

        if (typeof onSearch === "function") {
            onSearch(trimmed); // 검색 실행
        }

        if (onClose) onClose();
    };

    // 개별 삭제
    const handleDeleteKeyword = async (keyword) => {
        if (userId) {
            await deleteSearchItem(userId, keyword);
            const updated = recentKeywords.filter((item) => item !== keyword);
            setRecentKeywords(updated);
        } else {
            dispatch(removeRecentKeyword(keyword));
        }
    };

    // 전체 삭제
    const handleClearAll = async () => {
        if (userId) {
            await deleteAllSearchLogs(userId);
            setRecentKeywords([]);
        } else {
            dispatch(clearRecentKeywords());
        }
    };

    // 인기/최근 검색어 가져오기
    useEffect(() => {
        const loadSearchKeywords = async () => {
            if (userId) {
                const recents = await fetchRecentSearches(userId);
                setRecentKeywords(recents);
            } else {
                const stored = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
                setRecentKeywords(stored);
            }

            const popular = await fetchPopularSearches();
            setPopularKeywords(popular.map((item) => item.query));
        };

        loadSearchKeywords();
    }, [userId]);

    return (
        <SearchTermBox>
            <RecentBox>
                <RecentTitleBox>
                    <Text size="sm" $weight={800}>최근 검색어</Text>
                    <Text
                        size="xxs"
                        onClick={handleClearAll}
                        $weight={600}
                        color="grey"
                        style={{ cursor: 'pointer' }}
                    >
                        전체 삭제
                    </Text>
                </RecentTitleBox>

                <SearchScrollBox>
                    {!autoSave ? (
                        <AutoSaveBox>
                            <Text size="xs">검색어 저장 기능이 꺼져있습니다.</Text>
                            <Text size="xxs" color="grey" style={{marginTop: 4}}>"자동저장 켜기"를 활성화하면  최근검색어를 확인하실수 있습니다.</Text>
                        </AutoSaveBox>

                    ) : recentKeywords.length === 0 ? (
                        <AutoSaveBox>
                            <Text size="xs" color="grey">최근 검색어가 없습니다.</Text>
                        </AutoSaveBox>

                    ) : (
                        recentKeywords.map((item) => (
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
                                    onClick={() => handleDeleteKeyword(item)}
                                />
                            </RecentTextBox>
                        ))
                    )}
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
                    {popularKeywords.map((keyword, index) => (
                        <CommonButton
                            key={index}
                            width="90px"
                            height="30px"
                            fontSize="xxs"
                            fontWeight={900}
                            radius="full"
                            type="outline"
                            onClick={() => handleSearch(keyword)}
                        >
                            {keyword}
                        </CommonButton>
                    ))}
                </KeywordBox>
            </PopularityBox>
        </SearchTermBox>
    );
}

export default SearchTerm;

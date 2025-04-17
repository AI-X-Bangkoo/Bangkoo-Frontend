import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setSearchResults,
    setConfirmedKeyword,
    setKeyword,
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
    KeywordBox,
} from "./css/SearchInput.styled";
import { Text } from "@/common/Typography";
import CommonIconButton from "@/common/CommonIconButton"
import { ReactComponent as CloseIcon } from "@/assets/images/CloseIcon.svg";
import CommonButton from "@/common/CommonButton";
import useSearchHistory from "@/hooks/search/useSearchHistory";
import { useNavigate } from "react-router-dom";

import {
    fetchRecentSearches,
    deleteSearchItem,
    deleteAllSearchLogs,
    searchImageUnified,
    fetchPopularSearches
} from "@/api/search/search";

function SearchTerm({onClose}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { autoSave, toggleAuto } = useSearchHistory();
    const userId = useSelector((state) => state.auth.user?.userId || "anonymous");

    const [recentKeywords, setRecentKeywords] = useState([]);
    const [popularKeywords, setPopularKeywords] = useState([]);
    
    // 검색 실행
    const handleSearch = async (keyword) => {
        try {
            const trimmed = keyword.trim();
            if (!trimmed) return;

            dispatch(setKeyword(trimmed)); // input에 키워드 반영

            // userId 포함해서 텍스트 검색 API 호출
            const result = await searchImageUnified({
                imageFile: null,
                imageUrl: null,
                query: trimmed,
                userId: userId || "anonymous"
            });

            dispatch(setSearchResults(result));
            dispatch(setConfirmedKeyword(trimmed));
            dispatch(setUploadedImage(null));
            // dispatch(setKeyword("")); // 검색 완료 후 input 초기화

            if (onClose) onClose();
            navigate("/search");
        } catch (err) {
            console.error("검색 실패:", err);
        }
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
                    {recentKeywords.length === 0 ? (
                        <Text size="xs" color="grey">최근 검색어가 없습니다.</Text>
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

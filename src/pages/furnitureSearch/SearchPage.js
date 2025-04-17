import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AISearchComponent from "../search/AISearchComponent";
import {GridBox, SearchRoot, SearchTermBox, TextBox, LoadingBox} from "./css/SearchPage.styled";
import {Text} from "@/common/Typography";
import CommonButton from "@/common/CommonButton";
import CommonImageBox from "@/common/CommonImageBox";
import useAuth from "@/hooks/login/useAuth";
import { setSearchResults, setConfirmedKeyword, setLoading } from "@/features/search/searchSlice";
import { searchByText } from "@/api/search/search";
import LoadingSpinner from "@/common/LoadingSpinner";

function SearchPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { isLoggedIn, login, user } = useAuth(); // 로그인 상태, 로그인 함수
    const isLoading = useSelector(state => state.search.isLoading); // 로딩
    const [loadingDots, setLoadingDots] = useState(""); // 로딩

    const searchResults = useSelector((state) => state.search.resultList); // 검색 결과 불러오기
    const keyword = useSelector((state) => state.search.confirmedKeyword); // Redux에서 검색어 가져오기

    const userId = user?.userId || "anonymous";

    const goToRoom = () => {
        if (isLoggedIn) {
            navigate("/myroom");  // 홈 화면으로 리다이렉트
        } else {
            // 로그인 후 돌아올 경로 기억
            sessionStorage.setItem("redirectAfterLogin", "/myroom");
            login(); // 카카오 로그인 페이지로 이동
        }
    };

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setLoadingDots(prev => {
                if (prev === "...") return "";
                return prev + ".";
            });
        }, 500);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }, [isLoading]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("query");

        const fetchSearchResult = async () => {
            if (!query) return;

            try {
                dispatch(setLoading(true));

                const decodedQuery = decodeURIComponent(query); // 디코딩
                const result = await searchByText(decodedQuery, userId);
                dispatch(setSearchResults(result));
                dispatch(setConfirmedKeyword(decodedQuery));
            } catch (err) {
                console.error("검색 실패:", err);
            }finally {
                dispatch(setLoading(false)); // 로딩 끝
            }
        };

        fetchSearchResult();

        return () => {
            dispatch(setSearchResults([]));
        };
    }, [location.search, userId, dispatch]);

    return (
        <SearchRoot>
            <AISearchComponent/>

            <SearchTermBox>
                <Text size="base" $weight={800}>
                    {keyword || "검색 결과"}{" "}
                    <span style={{fontWeight: 500}}>({searchResults.length})</span>
                </Text>
            </SearchTermBox>

            {isLoading ?
                <LoadingBox>
                    <LoadingSpinner />
                    <Text size="base" $weight={500}>로딩중{loadingDots}</Text>
                </LoadingBox>
                
                :
                searchResults.length > 0 ? (
                    <GridBox>
                        {searchResults.map((item, index) => (
                            <div key={index}>
                                <CommonImageBox
                                    image={item.이미지}
                                    type={"basic"}
                                    onLink={item.링크}
                                    recommendationReason={item.추천이유 && item.추천이유}
                                />

                                <TextBox>
                                    <div>
                                        <Text size="xs" $weight={800}>{item.이름}</Text>
                                        <Text size="xs" $weight={600}>{item.설명}</Text>
                                    </div>

                                    <Text size="md" $weight={800}>
                                        ₩
                                        {item.할인가 != null ?
                                            item.할인가.toLocaleString()
                                            :
                                            item.정상가 != null ?
                                                item.정상가.toLocaleString()
                                                :
                                                "-"
                                        }
                                    </Text>
                                </TextBox>

                                <CommonButton
                                    width="100%"
                                    height="44px"
                                    fontSize="xs"
                                    fontWeight={900}
                                    radius="sm"
                                    type="fill"
                                    onClick={goToRoom}
                                >
                                    내방 인테리어 하러가기
                                </CommonButton>
                            </div>
                        ))}
                    </GridBox>
                ) : (
                    <Text size="base" $weight={500} color="dark" style={{ textAlign: "center", marginTop: "100px" }}>
                        검색 결과가 없습니다.
                    </Text>
                )

            }


        </SearchRoot>
    );
}

export default SearchPage;
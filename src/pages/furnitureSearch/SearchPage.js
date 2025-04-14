import React from "react";
import { useSelector } from "react-redux";
import AISearchComponent from "../search/AISearchComponent";
import {GridBox, SearchRoot, SearchTermBox, TextBox} from "./css/SearchPage.styled";
import {Text} from "@/common/Typography";
import CommonButton from "@/common/CommonButton";
import CommonImageBox from "@/common/CommonImageBox";
import {useNavigate} from "react-router-dom";
import useAuth from "@/hooks/login/useAuth";

function SearchPage() {
    const navigate = useNavigate();
    const { isLoggedIn, login } = useAuth(); // 로그인 상태, 로그인 함수

    const searchResults = useSelector((state) => state.search.resultList); // 검색 결과 불러오기
    const keyword = useSelector((state) => state.search.confirmedKeyword); // Redux에서 검색어 가져오기

    const goToRoom = () => {
        if (isLoggedIn) {
            navigate("/myroom");  // 홈 화면으로 리다이렉트
        } else {
            // 로그인 후 돌아올 경로 기억
            sessionStorage.setItem("redirectAfterLogin", "/myroom");
            login(); // 카카오 로그인 페이지로 이동
        }
    };


    return (
        <SearchRoot>
            <AISearchComponent/>


                <SearchTermBox>
                    <Text size="base" $weight={800}>
                        {keyword || "검색 결과"}{" "}
                        <span style={{fontWeight: 500}}>({searchResults.length})</span>
                    </Text>
                </SearchTermBox>
       
            <GridBox>
                {searchResults.map((item, index) => (
                    <div key={index}>
                        <CommonImageBox image={item.이미지} type={"basic"} onLink={item.링크}/>

                        <TextBox>
                            <Text size="xs" $weight={800}>{item.이름}</Text>
                            <Text size="xs" $weight={600}>{item.설명}</Text>
                            <Text size="md" $weight={800}>
                                ₩ {item.할인가 != null ? item.할인가.toLocaleString() : "-"}
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

        </SearchRoot>
    );
}

export default SearchPage;
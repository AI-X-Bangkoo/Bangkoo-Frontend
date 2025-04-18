import React, {useState, useEffect} from "react";
import {
    ButtonBox,
    CloseButton,
    NoContent,
    Content,
    DrawerRoot,
    DrawerWrapper,
    SearchBox,
    KeywordBox,
    TextBox
} from "./css/SearchDrawer.styled";
import {Text} from "@/common/Typography";
import AISearchComponent from "../search/AISearchComponent";
import CommonImageBox from "@/common/CommonImageBox";
import TestImage from "@/assets/images/TestImage.png";
import CommonButton from "@/common/CommonButton";
import { ReactComponent as CloseIcon } from "@/assets/images/CloseIcon.svg";

import { addFurniture } from "@/features/furniture/furnitureSlice";
import { useSelector, useDispatch } from "react-redux";
import useCheckedFurniture from "@/hooks/furniture/useCheckedFurniture";
import LoadingSpinner from "@/common/LoadingSpinner";

const SearchDrawer = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(false); // 애니메이션 제어용
    const dispatch = useDispatch();
    const myFurniture = useSelector((state) => state.furniture.list);
    const [list, setList] = useState([]);
    const [confirmedKeyword, setConfirmedKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingDots, setLoadingDots] = useState("");

    const {
        checkedItems,
        toggle,
        clearAll,
        getCheckedIds,
    } = useCheckedFurniture();

    // mount 후 슬라이드 인
    useEffect(() => {
        requestAnimationFrame(() => setIsOpen(true));
    }, []);

    useEffect(() => {
        if (!isLoading) return;
        const interval = setInterval(() => {
            setLoadingDots(prev => prev === "..." ? "" : prev + ".");
        }, 500);
        return () => clearInterval(interval);
    }, [isLoading]);

    const isInMyFurniture = (itemId) =>
        myFurniture.some((f) => f.originalId === itemId);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false); // 1. 애니메이션 시작
            setTimeout(() => {
                onClose();       // 3. 애니메이션 끝나고 컴포넌트 제거
            }, 300);           // 2. transition-duration 만큼 기다림
        }
    };

    const renderResults = () => {
        if (isLoading) {
            return (
                <NoContent>
                    <LoadingSpinner />
                    <Text size="base" $weight={500}>로딩중{loadingDots}</Text>
                </NoContent>
            );
        }
        if (list.length === 0) {
            return (
                <NoContent>
                    <Text size="base" $weight={500} color="dark" style={{ textAlign: "center", marginTop: "100px" }}>
                        검색 결과가 없습니다.
                    </Text>
                </NoContent>
            );
        }
        return (
            <Content>
                {list.map((item, index) => (
                    <div key={index}>
                        <CommonImageBox
                            image={item.이미지}
                            type="checkbox"
                            isChecked={!!checkedItems[index] || isInMyFurniture(index)}
                            onLink={item.링크}
                            onCheck={() => toggle(index)}
                            recommendationReason={item.추천이유}
                        />
                        <TextBox>
                            <Text size="xs" $weight={800}>{item.이름}</Text>
                            <Text size="xs" $weight={600}>{item.설명}</Text>
                            <Text size="xs" $weight={800}>
                                ₩{item.할인가 != null ? item.할인가.toLocaleString() : item.정상가 != null ? item.정상가.toLocaleString() : "-"}
                            </Text>
                        </TextBox>


                    </div>
                ))}
            </Content>
        );
    };

    return (
        <DrawerRoot onClick={handleOverlayClick}>
            <DrawerWrapper $isOpen={isOpen}>
                <Text size="base" $weight={800}>가구검색</Text>

                <SearchBox>
                    <AISearchComponent
                        mode="inline"
                        onSearchStart={() => {
                            setIsLoading(true);
                            setList([]);
                        }}
                        onSearchResults={(result, keyword) => {
                            setList(result);
                            setConfirmedKeyword(keyword);
                            setIsLoading(false);
                        }}
                    />
                </SearchBox>

                <KeywordBox>
                    <Text size="sm" $weight={800}>
                        {confirmedKeyword || "검색어"} <span style={{fontWeight: 500}}>({list.length})</span>
                    </Text>
                    <Text size="xxs" $weight={600} color="red">
                        * 체크된 가구만 배치가 가능합니다.
                    </Text>
                </KeywordBox>


                {renderResults()}

                <ButtonBox>
                    <CommonButton
                        width="120px"
                        height="44px"
                        fontSize="xs"
                        fontWeight={800}
                        radius="sm"
                        type="fill"
                        onClick={() => {
                            const selectedIds = getCheckedIds();
                            const selectedFurniture = list.filter( index =>
                                selectedIds.includes(index)
                            );

                            selectedFurniture.forEach((item, index) => {
                                dispatch(addFurniture({
                                    ...item,
                                    id: Date.now() + Math.random(),
                                    originalId: index,
                                    type: "hoverMinus",
                                    isCustom: true,
                                }));
                            });

                            clearAll();
                            onClose();
                        }}
                    >
                        배치
                    </CommonButton>
                </ButtonBox>

                <CloseButton onClick={handleOverlayClick}>
                    <CloseIcon/>
                    닫기
                </CloseButton>
            </DrawerWrapper>
        </DrawerRoot>
    );
};

export default SearchDrawer;

import React, {useState, useEffect} from "react";
import {
    ButtonBox, CloseButton,
    Content,
    DrawerRoot,
    DrawerWrapper,
    SearchBox,
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

const SearchDrawer = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(false); // 애니메이션 제어용
    const dispatch = useDispatch();
    const myFurniture = useSelector((state) => state.furniture.list);

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

    const list = [
        {
            id: 0,
            image: TestImage,
            link: 'https://www.ikea.com/kr/ko/p/lagan-integrated-dishwasher-40568019/',
            title: 'LAGAN 라간',
            text: '빌트인 식기세척기, 60 cm',
            price: 699000,
            isCheckable: true,
        },
        {
            id: 1,
            image: TestImage,
            link: 'https://www.ikea.com/kr/ko/p/lagan-integrated-dishwasher-40568019/',
            title: 'LAGAN 라간',
            text: '빌트인 식기세척기, 60 cm',
            price: 699000,
            isCheckable: true,
        },
        {
            id: 2,
            image: TestImage,
            link: 'https://www.ikea.com/kr/ko/p/lagan-integrated-dishwasher-40568019/',
            title: 'LAGAN 라간',
            text: '빌트인 식기세척기, 60 cm',
            price: 699000,
            isCheckable: false,
        },
        {
            id: 3,
            image: TestImage,
            link: 'https://www.ikea.com/kr/ko/p/lagan-integrated-dishwasher-40568019/',
            title: 'LAGAN 라간',
            text: '빌트인 식기세척기, 60 cm',
            price: 699000,
            isCheckable: false,
        },
        {
            id: 4,
            image: TestImage,
            link: 'https://www.ikea.com/kr/ko/p/lagan-integrated-dishwasher-40568019/',
            title: 'LAGAN 라간',
            text: '빌트인 식기세척기, 60 cm',
            price: 699000,
            isCheckable: true,
        },
    ]

    return (
        <DrawerRoot onClick={handleOverlayClick}>
            <DrawerWrapper $isOpen={isOpen}>
                <Text size="base" $weight={800}>가구검색</Text>

                <SearchBox>
                    <AISearchComponent/>
                </SearchBox>

                <TextBox>
                    <Text
                        size="sm"
                        $weight={800}
                    >
                        의자 <span style={{fontWeight: 500}}>(10,500)</span>
                    </Text>
                    <Text
                        size="xxs"
                        $weight={600}
                        color="red"
                    >
                        * 체크된 가구만 배치가 가능합니다.
                    </Text>
                </TextBox>


                <Content>
                    {list.map((item) => (
                        <div key={item.id}>
                            <CommonImageBox
                                image={item.image}
                                type={item.isCheckable ? "checkbox" : "basic"}
                                isChecked={!!checkedItems[item.id] || isInMyFurniture(item.id)}
                                onLink={item.link}
                                onCheck={() => toggle(item.id)}
                            />
                            <Text size="base" $weight={800}>{item.title}</Text>
                            <Text size="xs" $weight={600}>{item.text}</Text>
                            <Text size="xs" $weight={800}>₩ {item.price.toLocaleString()}</Text>
                        </div>
                    ))}
                </Content>

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
                            const selectedFurniture = list.filter(item =>
                                selectedIds.includes(item.id)
                            );

                            selectedFurniture.forEach((item) => {
                                dispatch(addFurniture({
                                    ...item,
                                    id: Date.now() + Math.random(),
                                    originalId: item.id,
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

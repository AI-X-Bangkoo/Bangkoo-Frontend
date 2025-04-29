import React from "react";
import { AddItem, FurnitureGrid, ImageBox } from "./css/MyRoom.styled";
import CommonImageBox from "../../common/CommonImageBox";
import CommonIconButton from "../../common/CommonIconButton";
import { ReactComponent as MinusIcon } from "../../assets/images/MinusIcon.svg";
import useFurnitureItem from "../../hooks/furniture/useFurnitureItems"; // 훅 사용

function MyFurnitureList({ furnitureList = [], onPlus, onSelect, onGlbSelect, setMode, setTutorialStep }) {
    // 훅에서 반환된 값 사용
    const { furnitureItems, handleminus } = useFurnitureItem(furnitureList); // `furnitureList`를 `furnitureItems`로 변환

    console.log("6.내 가구리스트 렌더, props, furnitureList:", furnitureList);

    return (
        <FurnitureGrid>
            {furnitureItems.map((item, index) => (
                <ImageBox
                    className={`furniture-item ${index === 0 ? "first-item" : ""} ${index === furnitureItems.length - 1 ? "last-item" : ""}`}
                    key={item.id}
                >
                    {item.type === "addFurniture" && (
                        <AddItem>
                            <CommonIconButton
                                icon={<MinusIcon />}
                                width="28px"
                                height="28px"
                                type="full"
                                color="red"
                                onClick={() => handleminus(item.image)} // 아이템 제거 함수 호출
                            />
                        </AddItem>
                    )}
                    <CommonImageBox
                        image={item.image}
                        type={item.type}
                        item={item}
                        index={index}
                        setMode={setMode}
                        onPlus={(e) => onPlus(item, index)}
                        onMinus={(item, index) => handleminus(item, index)} // `handleminus` 사용
                        onClick={() => {
                            const isGlb = item.model3dUrl?.toLowerCase().endsWith(".glb");
                            if (isGlb) {
                                onGlbSelect(item, index);
                            } else {
                                onSelect(index);
                            }

                            // 튜토리얼: 마지막 아이템 클릭 시 step3.5로
                            const isLast = index === furnitureItems.length - 1;
                            if (isLast) {
                                setTutorialStep && setTutorialStep("3.5");
                            }
                        }}
                    />
                </ImageBox>
            ))}
        </FurnitureGrid>
    );
}

export default MyFurnitureList;
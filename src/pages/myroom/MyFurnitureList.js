import React from "react";
import {AddItem, FurnitureGrid, ImageBox} from "./css/MyRoom.styled";
import CommonImageBox from "@/common/CommonImageBox";
import CommonIconButton from "../../common/CommonIconButton";
import { ReactComponent as MinusIcon } from "../../assets/images/MinusIcon.svg";

function MyFurnitureList({ furnitureList = [], onPlus, onMinus, onSelect, onGlbSelect, setMode, setTutorialStep }) {
    return (
        <FurnitureGrid>
            {furnitureList.map((item,index) => (
                <ImageBox
                    className={`furniture-item ${index === 0 ? "first-item" : ""} ${index === furnitureList.length - 1 ? "last-item" : ""}`}
                    key={item.id}
                >
                    {item.type === "addFurniture" &&
                        <AddItem>
                            <CommonIconButton
                                icon={<MinusIcon />}
                                width="28px"
                                height="28px"
                                type="full"
                                color="red"
                            />
                        </AddItem>
                    }
                    <CommonImageBox
                        // key={item.id}
                        image={item.image}
                        type={item.type}
                        item={item}                     // ✅ 추가
                        index={index}                   // ✅ 추가
                        setMode={setMode}
                        onPlus={(e) => onPlus(item,index)}
                        onMinus={(item, index) => onMinus(item, index)}
                        // onMinus={(e) => onMinus(item,index)}
                        onClick={() =>  {
                            const isGlb = item.model3dUrl?.toLowerCase().endsWith(".glb");
                            console.log(item.model3dUrl?.toLowerCase());
                            if (isGlb) {
                                console.log("🧩 GLB 파일 클릭됨:", item.model3dUrl);
                                console.log("클릭한 가구 index",index);
                                onGlbSelect(item, index);
                                // 여기에 GLB 전용 이벤트 추가
                                // 예: setSelectedModel(item.image) or loadGLBModel(item.image)
                            } else {
                                console.log("🖼️ JPG 이미지 클릭:", item.image);
                                console.log("클릭한 가구 index",index);
                                onSelect(index);  // 기존 이미지 선택 처리
                            }

                            // 튜토리얼: 마지막 아이템 클릭 시 step3.5로
                            const isLast = index === furnitureList.length - 1;
                            if (isLast) {
                                setTutorialStep && setTutorialStep("3.5");
                            }

                            // onSelect(index);
                        }} // ✅ 클릭 핸들러 연결

                        onPlusMinus={(e) => {  // 지은 추가
                            if (item.type === "hoverMinus") {
                                onMinus(item, index);
                            } else if (item.type === "hoverPlus") {
                                onPlus(item, index);
                            }
                        }}

                    />
                </ImageBox>
            ))}
        </FurnitureGrid>
    );
}

export default MyFurnitureList;
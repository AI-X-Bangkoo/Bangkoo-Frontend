import React from "react";
// styled-components를 통해 스타일이 정의된 컴포넌트들 import
import { AddItem, FurnitureGrid, ImageBox } from "./css/MyRoom.styled";
// 공통 이미지 박스 컴포넌트 import
import CommonImageBox from "@/common/CommonImageBox";
// 공통 아이콘 버튼 컴포넌트 import
import CommonIconButton from "../../common/CommonIconButton";
// 마이너스 아이콘 SVG 컴포넌트 import
import { ReactComponent as MinusIcon } from "../../assets/images/MinusIcon.svg";

// MyFurnitureList 컴포넌트 정의
function MyFurnitureList({
    furnitureList = [], // 기본값으로 빈 배열 설정
    onPlus, // 플러스 버튼 클릭시 실행될 함수
    onMinus, // 마이너스 버튼 클릭시 실행될 함수
    onSelect, // 이미지 클릭 시 실행될 함수
    onGlbSelect, // 3D 모델 클릭 시 실행될 함수
    setMode, // 모드 설정 함수
    setTutorialStep, // 튜토리얼 단계 설정 함수
}) {
    console.log("6.내 가구리스트 렌더, props,furniturerList:", furnitureList);

    return (
        <FurnitureGrid> {/* 가구 목록을 표시하는 그리드 컴포넌트 */}
            {furnitureList.map((item, index) => ( // furnitureList 배열을 순회하며 각 아이템 렌더링
                <ImageBox
                    className={`furniture-item ${index === 0 ? "first-item" : ""} ${index === furnitureList.length - 1 ? "last-item" : ""}`}
                    key={item.id} // 각 아이템의 고유 ID로 키 설정
                >
                    {/* addFurniture 타입일 경우 (새로운 가구 추가 아이템) */}
                    {item.type === "addFurniture" &&
                        <AddItem> {/* 아이템 추가 버튼 렌더링 */}
                            <CommonIconButton
                                icon={<MinusIcon />} // 마이너스 아이콘 사용
                                width="28px" // 아이콘의 크기 설정
                                height="28px" // 아이콘의 크기 설정
                                type="full" // 아이콘 스타일 설정
                                color="red" // 아이콘 색상 설정
                            />
                        </AddItem>
                    }

                    {/* 가구의 이미지 및 기타 정보를 담은 공통 이미지 박스 */}
                    <CommonImageBox
                        image={item.image} // 아이템의 이미지 URL
                        type={item.type} // 아이템 타입 (예: 가구 종류)
                        item={item} // 아이템 전체 정보
                        index={index} // 아이템의 인덱스
                        setMode={setMode} // 모드 설정 함수 전달
                        onPlus={(e) => onPlus(item, index)} // 플러스 버튼 클릭 시 호출
                        onMinus={(item, index) => onMinus(item, index)} // 마이너스 버튼 클릭 시 호출
                        onClick={() => { // 이미지 클릭 시 호출될 함수
                            const isGlb = item.model3dUrl?.toLowerCase().endsWith(".glb"); // GLB 모델 파일 여부 체크
                            console.log(item.model3dUrl?.toLowerCase());
                            if (isGlb) {
                                console.log("🧩 GLB 파일 클릭됨:", item.model3dUrl);
                                console.log("클릭한 가구 index", index);
                                onGlbSelect(item, index); // GLB 모델을 선택할 때 호출
                            } else {
                                console.log("🖼️ JPG 이미지 클릭:", item.image);
                                console.log("클릭한 가구 index", index);
                                onSelect(index); // 일반 이미지 클릭 시 호출
                            }

                            // 튜토리얼: 마지막 아이템 클릭 시 튜토리얼 단계 3.5로 변경
                            const isLast = index === furnitureList.length - 1;
                            if (isLast) {
                                setTutorialStep && setTutorialStep("3.5");
                            }
                        }}

                        // 마우스 오버시 플러스 또는 마이너스 버튼 클릭 처리
                        onPlusMinus={(e) => {
                            if (item.type === "hoverMinus") { // 마우스가 올려졌을 때 '마이너스' 버튼 클릭 처리
                                onMinus(item, index);
                            } else if (item.type === "hoverPlus") { // 마우스가 올려졌을 때 '플러스' 버튼 클릭 처리
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

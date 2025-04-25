import React, { useState } from "react";
import { FurnitureGrid, TextBox } from "./css/MyRoom.styled";
import CommonImageBox from "@/common/CommonImageBox";
import { Text } from "@/common/Typography";

function AIFurnitureList({ furnitureList = [], onPlus }) {
    const [hoveredItemId, setHoveredItemId] = useState(null); // 마우스 오버된 항목 관리

    const handleLinkClick = (link) => {
        // 추천 이유를 클릭하면 해당 링크로 이동
        window.open(link, "_blank");
    };

    return (
        <FurnitureGrid>
            {furnitureList.map((item) => {
                // 가격을 숫자로 변환하고, "정보 없음"이면 기본값 처리
                const price = item.가격 === "정보 없음"
                    ? "가격 정보 없음"
                    : parseInt(item.가격.replace(/[^0-9]/g, ''), 10);

                return (
                    <TextBox
                        key={item.링크}
                        onMouseEnter={() => setHoveredItemId(item.링크)} // 마우스 오버 시 아이템 설정
                        onMouseLeave={() => setHoveredItemId(null)} // 마우스 떠날 때 아이템 해제
                        style={{ position: "relative" }} // 이미지 위에 추천이유를 절대 위치로 설정
                    >
                        <CommonImageBox
                            image={item.이미지}
                            type={item.type}
                            onPlus={() => onPlus(item)}
                        />
                        {/* 마우스를 올리면 이미지 위에 추천 이유가 뜸 */}
                        {hoveredItemId === item.링크 && (
                            <Text
                                size="xxs"
                                $weight={400}
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    left: "10px",
                                    right: "10px",
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    color: "#fff",
                                    padding: "5px",
                                    borderRadius: "5px",
                                    zIndex: "1",
                                    cursor: "pointer" // 클릭할 수 있도록 커서 모양 변경
                                }}
                                onClick={() => handleLinkClick(item.링크)} // 링크 클릭 시 새 창에서 열기
                            >
                                추천 이유: {item.추천이유}
                            </Text>
                        )}
                        <Text size="xxs" $weight={800}>{item.이름}</Text>
                        <Text size="12px" $weight={600}>{item.설명}</Text>
                        <Text size="xxs" $weight={600}>
                            {typeof price === "number" ? `₩ ${price.toLocaleString()}` : price}
                        </Text>
                    </TextBox>
                );
            })}
        </FurnitureGrid>
    );
}

export default AIFurnitureList;

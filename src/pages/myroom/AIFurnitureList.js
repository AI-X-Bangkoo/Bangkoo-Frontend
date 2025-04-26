import React, { useState } from "react";
import { FurnitureGrid } from "./css/MyRoom.styled";
import CommonImageBox from "@/common/CommonImageBox";
import {
  TextBox,
  ImageWrapper,
  HoverReason,
  ItemName,
  ItemDescription,
  ItemPrice
} from "../myroom/css/AIFurnitureList.styled";

function AIFurnitureList({ furnitureList = [], onPlus }) {
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const handleLinkClick = (link) => {
    window.open(link, "_blank");
  };

  return (
    <FurnitureGrid>
      {furnitureList.map((item) => {
        const price =
          item.가격 === "정보 없음"
            ? "가격 정보 없음"
            : parseInt(item.가격.replace(/[^0-9]/g, ""), 10);

        return (
          <TextBox
            key={item.링크}
            onMouseEnter={() => setHoveredItemId(item.링크)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            <ImageWrapper>
              {/* CommonImageBox 위에 HoverReason이 겹치도록 배치 */}
              <CommonImageBox
                image={item.이미지}
                type={item.type || "aiPlus"} // 기본값으로 aiPlus 사용
                onPlus={() => {
                    console.log("1. 추가하려는 아이템 호출:", item)
                    onPlus(item)   
                }}
                recommendationReason={
                  hoveredItemId === item.링크 ? item.추천이유 : null
                }
              />
              {/* 아래는 CommonImageBox 내부에서 렌더링되는 방식이라 이 위치는 생략 가능 */}
              {/* hoveredItemId === item.링크 && (
                <HoverReason>추천 이유: {item.추천이유}</HoverReason>
              ) */}
            </ImageWrapper>

            <ItemName onClick={() => handleLinkClick(item.링크)}>{item.이름}</ItemName>
            <ItemDescription onClick={() => handleLinkClick(item.링크)}>{item.설명}</ItemDescription>
            <ItemPrice>
              {typeof price === "number" ? `₩ ${price.toLocaleString()}` : price}
            </ItemPrice>
          </TextBox>
        );
      })}
    </FurnitureGrid>
  );
}

export default AIFurnitureList;

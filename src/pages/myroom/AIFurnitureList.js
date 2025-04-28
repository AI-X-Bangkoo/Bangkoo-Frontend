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
          // 가격 처리
          const price =
              item.가격 === "정보 없음"
                  ? "가격 정보 없음"
                  : parseInt(item.가격.replace(/[^0-9]/g, ""), 10);

          return (
              <TextBox
                  key={item._id} // 고유한 _id를 key로 사용
                  onMouseEnter={() => setHoveredItemId(item._id)}
                  onMouseLeave={() => setHoveredItemId(null)}
              >
                <ImageWrapper>
                  <CommonImageBox
                      image={item.이미지}
                      type={item.type || "aiPlus"} // 기본값으로 aiPlus 사용
                      onPlus={() => {
                        console.log("1. 추가하려는 아이템 호출:", item);
                        onPlus(item);
                      }}
                      recommendationReason={
                        hoveredItemId === item._id ? item.추천이유 : null
                      }
                  />
                </ImageWrapper>

                <ItemName onClick={() => handleLinkClick(item.링크)}>
                  {item.이름}
                </ItemName>
                <ItemDescription onClick={() => handleLinkClick(item.링크)}>
                  {item.설명}
                </ItemDescription>

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
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
        const price = item.price
          ? item.price === "정보 없음"
            ? "가격 정보 없음"
            : parseInt(item.price.replace(/[^0-9]/g, ""), 10)
          : "가격 정보 없음"; // 가격 정보가 undefined일 경우 처리

        return (
          <TextBox
            key={item._id} // 고유한 _id를 key로 사용
            onMouseEnter={() => setHoveredItemId(item._id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            <ImageWrapper>
              <CommonImageBox
                image={item.image}
                type={item.type || "aiPlus"} // 기본값으로 aiPlus 사용
                onPlus={() => {
                    console.log("1. 추가하려는 아이템 호출:", item);
                    onPlus(item);
                }}
                recommendationReason={
                  hoveredItemId === item._id ? item.recommendationReason : null
                }
              />
            </ImageWrapper>

            <ItemName onClick={() => handleLinkClick(item.link)}>
              {item.name}
            </ItemName>
            <ItemDescription onClick={() => handleLinkClick(item.link)}>
              {item.description}
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

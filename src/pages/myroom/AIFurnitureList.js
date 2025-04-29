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
  // 고정된 제품 목록
  const fixedFurnitureList = [
    {
      _id: "X5CWg8n701A80A7D94448CE",
      name: "CANE COLLECTION TABLE (black)",
      description: "",
      detail: "",
      price: "2,850,000",
      link: "http://hpix.co.kr/product/cane-collection-table-black/6266/category/97/display/1/",
      category: "책상",
      imageUrl: "https://resources.archisketch.com/product/X5CWg8n701A80A7D94448CE/10-01-2022_04-58-39/preview/X5CWg8n701A80A7D94448CE_1.png",
      model3dUrl: "https://resources.archisketch.com/product/X5CWg8n701A80A7D94448CE/10-01-2022_04-58-39/Render/X5CWg8n701A80A7D94448CE.glb"
    },
    {
      _id: "X73s_05AEFA0627FD2247B4",
      name: "PK63™",
      description: "",
      detail: "",
      price: "0",
      link: "https://www.fritzhansen.com/ko/categories/by-series/PK63/PK63",
      category: "책상",
      imageUrl: "https://resources.archisketch.com/product/X73s_05AEFA0627FD2247B4/22-02-2022_06-22-48/preview/X73s_05AEFA0627FD2247B4_1.png",
      model3dUrl: "https://resources.archisketch.com/product/X73s_05AEFA0627FD2247B4/22-02-2022_06-22-48/Render/X73s_05AEFA0627FD2247B4.glb"
    }
  ];
  // 기존의 furnitureList와 고정된 furnitureList 결합
  const combinedFurnitureList = [...fixedFurnitureList, ...furnitureList];
  const handleLinkClick = (link) => {
    window.open(link, "_blank");
  };
  return (
    <FurnitureGrid>
      {combinedFurnitureList.map((item) => {
        // 가격 처리: `price`가 undefined일 경우 기본값 처리
        const price = item.price
          ? item.price === "정보 없음"
            ? "가격 정보 없음"
            : parseInt(item.price.replace(/[^0-9]/g, ""), 10)
          : "가격 정보 없음"; // `undefined`인 경우 "가격 정보 없음" 처리
        return (
          <TextBox
            key={item._id} // 고유한 _id 사용
            onMouseEnter={() => setHoveredItemId(item._id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            <ImageWrapper>
              <CommonImageBox
                image={item.imageUrl} // 이미지 URL을 사용
                type="aiPlus" // 기본값으로 aiPlus 사용
                onPlus={() => {
                  console.log("1. 추가하려는 아이템 호출:", item);
                  onPlus(item); // 아이템 추가 처리
                }}
              />
            </ImageWrapper>
            <ItemName onClick={() => handleLinkClick(item.link)}>
              {item.name} {/* 제품 이름 */}
            </ItemName>
            <ItemDescription onClick={() => handleLinkClick(item.link)}>
              {item.description || "설명 없음"} {/* 제품 설명, 없으면 '설명 없음' */}
            </ItemDescription>
            <ItemPrice>
              {typeof price === "number" ? `₩ ${price.toLocaleString()}` : price} {/* 가격 */}
            </ItemPrice>
          </TextBox>
        );
      })}
    </FurnitureGrid>
  );
}
export default AIFurnitureList;
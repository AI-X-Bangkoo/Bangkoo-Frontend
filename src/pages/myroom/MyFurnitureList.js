import React from "react";
import { FurnitureGrid } from "./css/MyRoom.styled";
import CommonImageBox from "@/common/CommonImageBox";

function MyFurnitureList({ furnitureList = [], onPlus, onMinus, onSelect, onGlbSelect }) {
    return (
        <FurnitureGrid>
            {furnitureList.map((item,index) => (
                <div className={`furniture-item ${index === 0 ? "first-item" : ""}`} key={item.id}>
                    <CommonImageBox
                        // key={item.id}
                        image={item.image}
                        type={item.type}
                        item={item}                     // ✅ 추가
                        index={index}                   // ✅ 추가
                        onPlus={(e) => onPlus(item,index)}
                        onMinus={(item, index) => onMinus(item, index)}
                        // onMinus={(e) => onMinus(item,index)}
                        onClick={() =>  {
                            const isGlb = item.model3dUrl?.toLowerCase().endsWith(".glb");
                            console.log(item.image);
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
                </div>
            ))}
        </FurnitureGrid>
    );
}

export default MyFurnitureList;

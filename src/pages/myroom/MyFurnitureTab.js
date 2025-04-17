import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MyFurnitureList from "./MyFurnitureList";
import { toggleFurniture } from "@/features/furniture/furnitureSlice";
import useCheckedFurniture from "@/hooks/furniture/useCheckedFurniture";
import {Text} from "../../common/Typography";
import {EmptyBox} from "./css/MyRoom.styled";
import {addFurniture, removeFurniture} from "../../features/furniture/furnitureSlice";

export default function MyFurnitureTab({ onCustomRemove,onSelect,setselectedIndex, selectedIndex,resetObjectPositionRef  }) {
    const dispatch = useDispatch();
    const furnitureList = useSelector((state) => state.furniture.list);

    const { uncheck } = useCheckedFurniture();

    const handleClick = (e,item) => {
        e.stopPropagation();
        if (item.isCustom) {
            console.log(item.type)
            onCustomRemove(item);
        } else {
            console.log(item.type)
            item.type === "eyeOn" ? dispatch(removeFurniture(item.id)) : dispatch(addFurniture(item.id));
        }

        // originalId 기준 -> SearchDrawer 체크 해제
        if (item.originalId !== undefined) {
            uncheck(item.originalId);
        }
    };

    const handleDelete = (item, index) => {
        if (Array.isArray(selectedIndex)) {
            if (!selectedIndex.includes(index)) {
                setselectedIndex((prev) => [...prev, index]);
            } else {
                resetObjectPositionRef(index);
            }
        }

    };
    // const handleDelete = (clickedItem) => {
    //     const indicesToMask = furnitureList
    //         .map((item, index) =>
    //             item.originalId === clickedItem.originalId ? index : null
    //         )
    //         .filter(index => index !== null);
    //
    //     setselectedIndex(indicesToMask);
    // };


    return (
        <>
            {furnitureList.length === 0 ?
                <EmptyBox>
                    <Text size="sm" $weight={500} color="dark">이동 혹은 삭제할  가구를 클릭해 주세요.</Text>
                </EmptyBox>
                :

                <MyFurnitureList furnitureList={furnitureList} onPlus={handleClick}
                                 onMinus={(item, index) => {
                                     console.log("🧹 클릭한 가구 index", index);

                                     if (!resetObjectPositionRef?.current) {
                                         console.warn("⚠️ resetObjectPositionRef가 정의되지 않았습니다.");
                                         return;
                                     }

                                     resetObjectPositionRef.current(index); // ✅ 원래 위치 복원

                                     // ✅ 여기 아래에 이 코드 추가하세요!
                                     setselectedIndex((prev) => (prev === index ? null : index));
                                     setTimeout(() => setselectedIndex(index), 0); // ✅ 강제 리렌더
                                 }}

                    // onMinus={handleDelete}
                                 onSelect={(index) => {
                                     if (typeof setselectedIndex === "function") {
                                         setselectedIndex((prev) => (prev === index ? null : index));
                                     }
                                 }} />
            }
        </>
    );
}
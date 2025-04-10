import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MyFurnitureList from "./MyFurnitureList";
import { toggleFurniture } from "@/features/furniture/furnitureSlice";
import useCheckedFurniture from "@/hooks/furniture/useCheckedFurniture";
import {Text} from "../../common/Typography";
import {EmptyBox} from "./css/MyRoom.styled";

export default function MyFurnitureTab({ onCustomRemove }) {
    const dispatch = useDispatch();
    const furnitureList = useSelector((state) => state.furniture.list);

    const { uncheck } = useCheckedFurniture();

    const handleClick = (item) => {
        if (item.isCustom) {
            onCustomRemove(item);
        } else {
            dispatch(toggleFurniture(item.id));
        }

        // originalId 기준 -> SearchDrawer 체크 해제
        if (item.originalId !== undefined) {
            uncheck(item.originalId);
        }
    };

    return (
        <>
            {furnitureList.length === 0 ?
                <EmptyBox>
                    <Text size="sm" $weight={500} color="dark">이동 혹은 삭제할  가구를 클릭해 주세요.</Text>
                </EmptyBox>
                :
                <MyFurnitureList furnitureList={furnitureList} onPlusMinus={handleClick} />
            }
        </>
    );
}
import { useSelector } from "react-redux";
import MyInterior from "./MyInterior";
import {Text} from "../../common/Typography";
import {EmptyBox} from "./MyRoom.styled";
import React from "react";

export default function InteriorTab({ onDelete, onDeleteAll }) {
    const interiorList = useSelector((state) => state.interior.list);

    return (
        <>
            {interiorList.length === 0 ?
                <EmptyBox>
                    <Text size="sm" $weight={500} color="dark">저장된 내방 인테리어가 없습니다.</Text>
                </EmptyBox>
                :
                <MyInterior
                    interiorList={interiorList}
                    onDelete={onDelete}
                    onDeleteAll={onDeleteAll}
                />
            }

        </>

    );
}
import React, { useState, useEffect } from "react";
import {InteriorBox, InteriorControllerBox} from "./MyRoom.styled";
import MyInteriorList from "./MyInteriorList";
import CommonButton from "../../common/CommonButton";

function MyInterior({ interiorList = [], onDelete }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [displayList, setDisplayList] = useState(interiorList);

    // 편집 모드에 따라 type 변경
    useEffect(() => {
        if (isEditMode) {
            const updated = interiorList.map((item) => ({ ...item, type: "removeButton" }));
            setDisplayList(updated);
        } else {
            const updated = interiorList.map((item) => ({ ...item, type: "basic" }));
            setDisplayList(updated);
        }
    }, [isEditMode, interiorList]);

    // 삭제 핸들러
    const handleDelete = (item) => {
        const filtered = displayList.filter(i => i.id !== item.id);
        setDisplayList(filtered);
    };

    // 전체 삭제
    const handleDeleteAll = () => {
        setDisplayList([]);
    };

    const buttonProps = {
        width: "90px",
        height: "34px",
        fontSize: "xxs",
        fontWeight: 800,
        radius: "sm",
        type: "full"
    };

    return (
        <InteriorBox>
            <InteriorControllerBox>
                {isEditMode && (
                    <CommonButton
                        {...buttonProps}
                        bg="red"
                        onClick={handleDeleteAll}
                    >
                        전체 삭제
                    </CommonButton>
                )}

                <CommonButton
                    {...buttonProps}
                    onClick={() => setIsEditMode(!isEditMode)}
                >
                    {isEditMode ? "편집 취소" : "편집"}
                </CommonButton>
            </InteriorControllerBox>
            <MyInteriorList interiorList={displayList} onDelete={handleDelete}/>
        </InteriorBox>
    );
}

export default MyInterior;

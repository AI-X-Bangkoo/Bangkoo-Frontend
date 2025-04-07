import React, { useState } from "react";
import { GridBox, LeftPanel, MainLayout, RightPanel, TabBox } from "./MyRoom.styled";
import FurnitureController from "./FurnitureController";
import FurnitureAIController from "./FurnitureAIController";
import CommonTabs from "../../common/CommonTabs";
import TestImage from "../../assets/images/TestImage.png";
import { Text } from "../../common/Typography";
import CommonDialog from "../../common/CommonDialog";

import MyFurnitureTab from "./MyFurnitureTab";
import AIFurnitureTab from "./AIFurnitureTab";
import InteriorTab from "./InteriorTab";

import { useFurnitureDialog, useInteriorDialog } from "./useFurnitureDialog";
import { useAddFurnitureWithToast } from "./useAddFurnitureWithToast";

function MyRoom() {
    const [currentTab, setCurrentTab] = useState("my");

    const [myFurnitureList, setMyFurnitureList] = useState([
        { id: 1, image: TestImage, type: "hoverMinus", isCustom: false },
        { id: 2, image: TestImage, type: "hoverMinus", isCustom: false },
        { id: 3, image: TestImage, type: "hoverMinus", isCustom: false },
        { id: 4, image: TestImage, type: "hoverMinus", isCustom: false },
    ]);

    const [aiFurnitureList] = useState([
        { id: 5, image: TestImage, type: "aiPlus", title: "LAGAN 라간", text: "빌트인 식기세척기, 60cm", price: 699000 },
        { id: 6, image: TestImage, type: "aiPlus", title: "LAGAN 라간", text: "빌트인 식기세척기, 60cm", price: 699000 },
        { id: 7, image: TestImage, type: "aiPlus", title: "LAGAN 라간", text: "빌트인 식기세척기, 60cm", price: 699000 },
        { id: 8, image: TestImage, type: "aiPlus", title: "LAGAN 라간", text: "빌트인 식기세척기, 60cm", price: 699000 },
    ]);

    const [interiorList, setInteriorList] = useState([
        { id: 1, image: TestImage, type: "removeButton", text: "첫번째 내방 인테리어" },
        { id: 2, image: TestImage, type: "removeButton", text: "인테리어 설명인테리어 설명인테리어 설명인테리어 설명인테리어 설명인테리어 설명인테리어 설명" },
        { id: 3, image: TestImage, type: "removeButton", text: "첫번째 내방 인테리어" },
    ]);

    const furnitureDialog = useFurnitureDialog();
    const interiorDialog = useInteriorDialog();
    const addFurniture = useAddFurnitureWithToast(setMyFurnitureList);

    const tabList = [
        { id: "my", label: "나의 가구" },
        { id: "recommend", label: "추천 가구" },
        { id: "interior", label: "내 인테리어" },
    ];

    const handlePlusMinus = (item) => {
        if (item.isCustom) {
            furnitureDialog.openDialog(item);
        } else {
            setMyFurnitureList((prev) =>
                prev.map((f) =>
                    f.id === item.id ? { ...f, type: f.type === "hoverMinus" ? "hoverPlus" : "hoverMinus" } : f
                )
            );
        }
    };

    const handleConfirmDelete = () => {
        setMyFurnitureList((prev) => prev.filter((f) => f.id !== furnitureDialog.selectedItem.id));
        furnitureDialog.closeDialog();
    };

    const handleConfirmInteriorDelete = () => {
        if (interiorDialog.deleteAll) {
            setInteriorList([]);
        } else if (interiorDialog.selectedItem) {
            setInteriorList((prev) => prev.filter((i) => i.id !== interiorDialog.selectedItem.id));
        }
        interiorDialog.close();
    };

    return (
        <MainLayout>
            <LeftPanel>
                <FurnitureController />
            </LeftPanel>
            <RightPanel>
                <FurnitureAIController />
                <TabBox>
                    <CommonTabs tabs={tabList} current={currentTab} onChange={setCurrentTab} />
                </TabBox>
                <GridBox>
                    {currentTab === "my" && <MyFurnitureTab furnitureList={myFurnitureList} onPlusMinus={handlePlusMinus} />}
                    {currentTab === "recommend" && <AIFurnitureTab furnitureList={aiFurnitureList} onPlus={addFurniture} />}
                    {currentTab === "interior" && <InteriorTab interiorList={interiorList} onDelete={interiorDialog.openDelete} onDeleteAll={interiorDialog.openDeleteAll} />}
                </GridBox>
            </RightPanel>

            <CommonDialog
                open={furnitureDialog.open}
                title="알림"
                submitText="제거"
                onClose={furnitureDialog.closeDialog}
                onClick={handleConfirmDelete}
            >
                <Text size="xs" $weight={500}>내가구 목록에서 제거하시겠습니까?</Text>
            </CommonDialog>

            <CommonDialog
                open={interiorDialog.open}
                title="알림"
                submitText="제거"
                onClose={interiorDialog.close}
                onClick={handleConfirmInteriorDelete}
            >
                <Text size="xs" $weight={500}>
                    {interiorDialog.deleteAll
                        ? "사진을 모두 삭제하시겠습니까?"
                        : "사진을 정말 삭제하시겠습니까?"}
                </Text>
            </CommonDialog>
        </MainLayout>
    );
}

export default MyRoom;
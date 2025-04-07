import React, {useState} from "react";
import {GridBox, LeftPanel, MainLayout, RightPanel, TabBox} from "./MyRoom.styled";
import FurnitureController from "./FurnitureController";
import FurnitureAIController from "./FurnitureAIController";
import CommonTabs from "../../common/CommonTabs";
import TestImage from "../../assets/images/TestImage.png";
import MyFurnitureList from "./MyFurnitureList";
import AIFurnitureList from "./AIFurnitureList";
import MyInterior from "./MyInterior";
import { toast } from "react-toastify";
import CustomToast from "../../common/CustomToast";
import CommonDialog from "../../common/CommonDialog";
import {Text} from "../../common/Typography";

function MyRoom() {
    const [currentTab, setCurrentTab] = useState("my");
    const [showFurnitureDeleteDialog, setShowFurnitureDeleteDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [showInteriorDeleteDialog, setShowInteriorDeleteDialog] = useState(false);
    const [selectedInteriorItem, setSelectedInteriorItem] = useState(null);
    const [deleteAllInterior, setDeleteAllInterior] = useState(false);

    const tabList = [
        { id: "my", label: "나의 가구" },
        { id: "recommend", label: "추천 가구" },
        { id: "interior", label: "내 인테리어" }
    ];

    const [myFurnitureList, setMyFurnitureList] = useState([
        { id: 1, image: TestImage, type: "hoverMinus", isCustom: false },
        { id: 2, image: TestImage, type: "hoverMinus", isCustom: false },
        { id: 3, image: TestImage, type: "hoverMinus", isCustom: false },
        { id: 4, image: TestImage, type: "hoverMinus", isCustom: false },
    ]);

    const [aiFurnitureList, setAiFurnitureList] = useState([
        { id: 5, image: TestImage, type: "aiPlus", title:"LAGAN 라간", text:"빌트인 식기세척기, 60cm", price: 699000},
        { id: 6, image: TestImage, type: "aiPlus", title:"LAGAN 라간", text:"빌트인 식기세척기, 60cm", price: 699000 },
        { id: 7, image: TestImage, type: "aiPlus", title:"LAGAN 라간", text:"빌트인 식기세척기, 60cm", price: 699000 },
        { id: 8, image: TestImage, type: "aiPlus", title:"LAGAN 라간", text:"빌트인 식기세척기, 60cm", price: 699000 },
    ]);

    const [interiorList, setInteriorList] = useState([
        { id: 1, image: TestImage, type: "removeButton", text:"첫번째 내방 인테리어"},
        { id: 2, image: TestImage, type: "removeButton", text:"첫번째 내방 인테리어첫번째 내방 인테리어첫번째 내방 인테리어첫번째 내방 인테리어"},
        { id: 3, image: TestImage, type: "removeButton", text:"첫번째 내방 인테리어"},

    ]);

    // 클릭 시 이벤트 핸들러
    const handlePlusMinus = (item) => {
        if (item.isCustom) {
            setSelectedItem(item);
            setShowFurnitureDeleteDialog(true);
        } else {
            setMyFurnitureList((prevList) =>
                prevList.map((f) =>
                    f.id === item.id
                        ? {
                            ...f,
                            type: f.type === "hoverMinus" ? "hoverPlus" : "hoverMinus",
                        }
                        : f
                )
            );
        }
    };

    const handleConfirmDelete = () => {
        setMyFurnitureList((prevList) =>
            prevList.filter(f => f.id !== selectedItem.id)
        );
        setShowFurnitureDeleteDialog(false);
        setSelectedItem(null);
    };

    const handleCloseDialog = () => {
        setShowFurnitureDeleteDialog(false);
        setSelectedItem(null);
    };

    const handlePlus = (item) => {
        const newItem = {
            ...item,
            id: Date.now(), // 고유 ID로 여러 번 추가되도록
            type: "hoverMinus",
            isCustom: true,
        };

        setMyFurnitureList((prev) => [...prev, newItem]);

        toast(({ closeToast }) => (
            <CustomToast
                message="선택하신 가구가 내 가구에 추가되었습니다."
                closeToast={closeToast}
            />
        ), {
            position: "top-center",
            autoClose: 5000, // 5초
            hideProgressBar: true,
            closeButton: false, // 커스텀 버튼 쓸 거니까 기본 버튼 제거
        });
    };

    // 인테리어 삭제 다이얼로그 오픈
    const handleInteriorDelete = (item) => {
        setSelectedInteriorItem(item);
        setDeleteAllInterior(false);
        setShowInteriorDeleteDialog(true);
    };

// 전체 삭제 다이얼로그 오픈
    const handleInteriorDeleteAll = () => {
        setDeleteAllInterior(true);
        setShowInteriorDeleteDialog(true);
    };

// 다이얼로그 '제거' 버튼 클릭 시
    const handleConfirmInteriorDelete = () => {
        if (deleteAllInterior) {
            setInteriorList([]);
        } else if (selectedInteriorItem) {
            setInteriorList((prev) => prev.filter(i => i.id !== selectedInteriorItem.id));
        }

        setShowInteriorDeleteDialog(false);
        setSelectedInteriorItem(null);
        setDeleteAllInterior(false);
    };

// 다이얼로그 닫기
    const handleCloseInteriorDialog = () => {
        setShowInteriorDeleteDialog(false);
        setSelectedInteriorItem(null);
        setDeleteAllInterior(false);
    };

    return (
        <MainLayout>
            <LeftPanel>
                <FurnitureController/>
            </LeftPanel>
            <RightPanel>
                <FurnitureAIController/>
                <TabBox>
                    <CommonTabs
                        tabs={tabList}
                        current={currentTab}
                        onChange={setCurrentTab}
                    />
                </TabBox>

                <GridBox>
                    {currentTab === "my" &&
                        <MyFurnitureList furnitureList={myFurnitureList} onPlusMinus={handlePlusMinus}/>
                    }

                    {currentTab === "recommend" &&
                        <AIFurnitureList furnitureList={aiFurnitureList} onPlus={handlePlus}/>
                    }

                    {currentTab === "interior" &&
                        <MyInterior
                            interiorList={interiorList}
                            onDelete={handleInteriorDelete}
                            onDeleteAll={handleInteriorDeleteAll}
                        />
                    }
                </GridBox>

            </RightPanel>

            <CommonDialog
                open={showFurnitureDeleteDialog}
                title={"알림"}
                submitText={"제거"}
                onClose={handleCloseDialog}
                onClick={handleConfirmDelete}
                children={
                    <Text size="xs" $weight={500}>내가구 목록에서 제거하시겠습니까?</Text>
                }
            />

            <CommonDialog
                open={showInteriorDeleteDialog}
                title={"알림"}
                submitText={"제거"}
                onClose={handleCloseInteriorDialog}
                onClick={handleConfirmInteriorDelete}
                children={
                    <Text size="xs" $weight={500}>
                        {deleteAllInterior
                            ? "사진을 모두 삭제하시겠습니까?"
                            : "사진을 정말 삭제하시겠습니까?"}
                    </Text>
                }
            />
        </MainLayout>
    );
}

export default MyRoom;
import React, { useState, useEffect , useRef} from "react";
import { useDispatch } from "react-redux";
import { GridBox, LeftPanel, MainLayout, RightPanel, TabBox } from "./css/MyRoom.styled";
import FurnitureController from "./FurnitureController";
import FurnitureAIController from "./FurnitureAIController";
import CommonTabs from "@/common/CommonTabs";
import { Text } from "@/common/Typography";
import CommonDialog from "@/common/CommonDialog";
import MyFurnitureTab from "./MyFurnitureTab";
import AIFurnitureTab from "./AIFurnitureTab";
import InteriorTab from "./InteriorTab";
import {
    useAIDialog,
    useFurnitureDialog,
    useInteriorDialog,
    useInteriorSaveDialog,
    useSettingDialog
} from "@/hooks/dialog/useFurnitureDialog";
import { useAddFurnitureWithToast } from "@/hooks/furniture/useAddFurnitureWithToast";
import { useMyRoomLogic } from "@/hooks/furniture/useMyRoomLogic";
import { setInitialFurniture } from "@/features/furniture/furnitureSlice";
import { setInterior } from "@/features/furniture/interiorSlice";
import { setRecommendedFurniture } from "@/features/furniture/recommendedSlice";
import TestImage from "@/assets/images/TestImage.png";
import InteriorSave from "./dialog/InteriorSave";
import Setting from "./dialog/Setting";
import AiRecommended from "./dialog/AiRecommended";
import SearchDrawer from "./SearchDrawer";
import ImageUploader from "./ImageUploader";
import { useGlobalInertEffect } from "@/hooks/dialog/useGlobalInertEffect";
import { useSaveInterior } from "@/hooks/useSaveInterior";

function MyRoom() {
    const [currentTab, setCurrentTab] = useState("my");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedIndex, setselectedIndex] = useState(null);
    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);
    const canvasRef = useRef(null);
    const uploaderRef = useRef(null);

    // 이미지 등록 시 상태 값 체크용도 "김범석"
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    // const handleImageUploaded = (uploaded) => {
    //     setIsImageUploaded(uploaded);
    // };
    //  여기까지
    const dispatch = useDispatch();
    const furnitureDialog = useFurnitureDialog();
    const interiorDialog = useInteriorDialog();
    const interiorSaveDialog = useInteriorSaveDialog();
    const settingDialog = useSettingDialog();
    const aiDialog = useAIDialog();
    const addFurniture = useAddFurnitureWithToast();
    const { handleConfirmDelete, handleConfirmInteriorDelete } = useMyRoomLogic(furnitureDialog, interiorDialog);
    const handleSave = useSaveInterior(canvasRef, interiorSaveDialog.closeDialog);
    const resetObjectPositionRef = useRef();
    const [centerArea, setCenterArea] = useState(null);
    useGlobalInertEffect([
        furnitureDialog.open,
        interiorDialog.open,
        interiorSaveDialog.open,
        settingDialog.open,
        aiDialog.open,
    ]);

    useEffect(() => {
        dispatch(setInitialFurniture([
            { id: 1, image: TestImage, type: "eyeOn", isCustom: false },
            { id: 2, image: TestImage, type: "eyeOn", isCustom: false },
            { id: 3, image: TestImage, type: "eyeOn", isCustom: false },
            { id: 4, image: TestImage, type: "eyeOn", isCustom: false },
        ]));

        dispatch(setInterior([
            { id: 1, image: TestImage, type: "removeButton", text: "첫번째 내방 인테리어" },
            { id: 2, image: TestImage, type: "removeButton", text: "인테리어 설명 인테리어 설명 인테리어 설명" },
            { id: 3, image: TestImage, type: "removeButton", text: "세 번째 인테리어" },
        ]));

        dispatch(setRecommendedFurniture([
            { id: 101, image: TestImage, type: "aiPlus", title: "LAGAN 라간 1", text: "빌트인 식기세척기, 60cm", price: 699000 },
            { id: 102, image: TestImage, type: "aiPlus", title: "LAGAN 라간 2", text: "스마트 테이블", price: 299000 },
            { id: 103, image: TestImage, type: "aiPlus", title: "LAGAN 라간 3", text: "슬림 책상 세트", price: 159000 },
            { id: 104, image: TestImage, type: "aiPlus", title: "LAGAN 라간 4", text: "인테리어 장식장", price: 499000 },
        ]));
    }, [dispatch]);

    const tabList = [
        { id: "my", label: "나의 가구" },
        { id: "recommend", label: "추천 가구" },
        { id: "interior", label: "내 인테리어" },
    ];

    return (
        <MainLayout>
            <LeftPanel>
                <FurnitureController
                    saveClick={interiorSaveDialog.openDialog}
                    aiClick={aiDialog.openDialog}
                    canvasRef={canvasRef}
                    centerArea={centerArea} // ⬅️ 전달
                    handleFileChange = {(file) => uploaderRef.current?.handleFileChange(file)}
                />
                <ImageUploader
                    ref={uploaderRef}
                    canvasRef={canvasRef}
                    onObjectSelect={(index) => setselectedIndex(index)}
                    resetObjectPositionRef={resetObjectPositionRef}
                    selectedIndex={selectedIndex}        // ✅ 이거 꼭 추가!
                    setselectedIndex={setselectedIndex}  // ✅ 이것도 함께!
                    setCenterArea={setCenterArea} // ⬅️ 이거 추가
                />
                {!isImageUploaded ? (
                    <Text size="sm" $weight={600} >
                        이미지 등록 시
                        <span style={{fontWeight:800}}> 반드시 "가로 사진"</span>
                        으로 등록해주세요.
                    </Text>
                    ) : (
                <Text size="sm" $weight={600} >
                    가구 추가, 이동, 제거가 완료되면
                    <span style={{fontWeight:800}}> 배치 결과 보기</span>
                    버튼을 눌러주세요
                </Text>
                )}
            </LeftPanel>
            <RightPanel>
                <FurnitureAIController
                    settingClick={settingDialog.openDialog}
                    onSearchClick={openDrawer}
                />
                {/* 검색 drawer 영역*/}
                {isDrawerOpen && <SearchDrawer onClose={closeDrawer} />}

                <TabBox>
                    <CommonTabs tabs={tabList} current={currentTab} onChange={setCurrentTab} />
                </TabBox>
                <GridBox>
                    {currentTab === "my" && <MyFurnitureTab
                        onCustomRemove={furnitureDialog.openDialog}
                        // onSelect={(index) => {
                        // selectedIndex = index;
                        // setselectedIndex(prev => {
                        //     return prev === index ? null : index; // 같은 거 누르면 해제, 아니면 새로 선택
                        // });
                        // resetObjectPositionRef={resetObjectPositionRef}
                        onSelect={(index) => setselectedIndex(index)}
                        setselectedIndex={setselectedIndex}  // ✅ 이거 꼭 전달!!
                        selectedIndex={selectedIndex}
                        resetObjectPositionRef={resetObjectPositionRef}
                    />}
                    {currentTab === "recommend" && <AIFurnitureTab onPlus={addFurniture} />}
                    {currentTab === "interior" && <InteriorTab onDelete={interiorDialog.openDelete} onDeleteAll={interiorDialog.openDeleteAll} />}
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

            <CommonDialog
                open={interiorSaveDialog.open}
                title="인테리어 저장"
                submitText="저장"
                onClose={interiorSaveDialog.closeDialog}
                onClick={handleSave}
            >
                <InteriorSave canvasRef={canvasRef}/>
            </CommonDialog>

            <CommonDialog
                open={settingDialog.open}
                title="AI 추천 조건"
                submitText="설정"
                onClose={settingDialog.closeDialog}
                onClick={() => {}}
            >
                <Setting/>
            </CommonDialog>

            <CommonDialog
                open={aiDialog.open}
                title="AI 추천 가구"
                submitText="설정"
                cancel={false}
                submit={false}
                onClose={aiDialog.closeDialog}
            >
                <AiRecommended/>
            </CommonDialog>
        </MainLayout>
    );
}

export default MyRoom;

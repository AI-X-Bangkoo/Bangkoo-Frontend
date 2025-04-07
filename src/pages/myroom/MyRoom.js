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

function MyRoom() {
    const [currentTab, setCurrentTab] = useState("my");

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
            // 추천에서 추가된 항목이면 제거
            setMyFurnitureList((prevList) =>
                prevList.filter(f => f.id !== item.id)
            );
        } else {
            // 기본 가구면 type만 토글
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

    const handleDelete = (item) => {
        setInteriorList((prevList) => prevList.filter(i => i.id !== item.id));
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
                        <MyInterior interiorList={interiorList} onDelete={handleDelete}/>
                    }
                </GridBox>

            </RightPanel>
        </MainLayout>
    );
}

export default MyRoom;
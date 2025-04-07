import React, {useState} from "react";
import {GridBox, LeftPanel, MainLayout, RightPanel, TabBox} from "./MyRoom.styled";
import FurnitureController from "./FurnitureController";
import FurnitureAIController from "./FurnitureAIController";
import CommonTabs from "../../common/CommonTabs";
import TestImage from "../../assets/images/TestImage.png";
import FurnitureList from "./FurnitureList";

function MyRoom() {
    const [currentTab, setCurrentTab] = useState("my");

    const tabList = [
        { id: "my", label: "나의 가구" },
        { id: "recommend", label: "추천 가구" },
        { id: "interior", label: "내 인테리어" }
    ];

    const [furnitureList, setFurnitureList] = useState([
        { id: 1, image: TestImage, type: "hoverMinus" },
        { id: 2, image: TestImage, type: "hoverMinus" },
        { id: 3, image: TestImage, type: "hoverMinus" },
        { id: 4, image: TestImage, type: "hoverMinus" },
    ]);

    // 클릭 시 이벤트 핸들러
    const handlePlusMinus = (item) => {
        setFurnitureList((prevList) =>
            prevList.map((furniture) =>
                furniture.id === item.id
                    ? {
                        ...furniture,
                        type: furniture.type === "hoverMinus" ? "hoverPlus" : "hoverMinus",
                    }
                    : furniture
            )
        );
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
                    <FurnitureList furnitureList={furnitureList} onPlusMinus={handlePlusMinus}/>
                </GridBox>
            </RightPanel>
        </MainLayout>
    );
}

export default MyRoom;
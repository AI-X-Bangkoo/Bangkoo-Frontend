import React, {useState} from "react";
import {InteriorImageBox, InteriorRoot} from "./css/InteriorSave.styled";
import TestMyRoom from "../../../assets/images/TestMyRoom.jpg"
import {Text} from "../../../common/Typography";
import CommonTextField from "../../../common/CommonTextField";

function InteriorSave() {
    const [explanation, setExplanation] = useState("");

    return(
        <InteriorRoot>
            <InteriorImageBox>
                <img src={TestMyRoom} alt={"내방 이미지"} />
            </InteriorImageBox>

            <Text size="xxs" $weight={600}>인테리어 설명</Text>
            <CommonTextField
                placeholder="내방 인테리어 설명을 간단하게 작성해 주세요."
                height="34px"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                custom="outline"
                line="grey"
                fontSize="xxs"
                onClearAll={() => {
                    setExplanation("");
                }}
            />
        </InteriorRoot>
    )
}

export default InteriorSave;
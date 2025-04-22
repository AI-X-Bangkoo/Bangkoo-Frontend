import React, { useEffect, useState } from "react";
import TutorialOverlay from "./TutorialOverlay";
import {
    Backdrop,
    TransparentHole,
    HighlightStyle
} from "./css/Tutorial.styled";
import CommonButton from "../../common/CommonButton";

const buttonProps = {
    width:"40px",
    height: "24px",
    fontSize: "xxs",
    borderRadius: 0,
    fontWeight: 600
};

function TutorialStep1({onNext, onPrev, onSkip}) {
    const [buttonBox, setButtonBox] = useState(null);
    const [uploadBox, setUploadBox] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const uploadBoxes = document.querySelectorAll(".upload-area");

        if (uploadBoxes.length >= 2) {
            const buttonRect = uploadBoxes[0].getBoundingClientRect();
            const uploadRect = uploadBoxes[1].getBoundingClientRect();

            setButtonBox({
                top: buttonRect.top + window.scrollY,
                left: buttonRect.left + window.scrollX,
                width: buttonRect.width,
                height: buttonRect.height,
            });

            setUploadBox({
                top: uploadRect.top + window.scrollY,
                left: uploadRect.left + window.scrollX,
                width: uploadRect.width,
                height: uploadRect.height,
            });

            // 말풍선은 버튼 기준
            setTooltipPos({
                top: buttonRect.top + window.scrollY - 80,
                left: buttonRect.left + window.scrollX + buttonRect.width / 2 - 120,
            });

            // z-index 조정
            uploadBoxes.forEach(el => {
                el.dataset.prevZIndex = el.style.zIndex;
                el.dataset.prevPosition = el.style.position;
                el.style.zIndex = "9999";
                el.style.position = "relative";
            });
        }

        return () => {
            uploadBoxes.forEach(el => {
                el.style.zIndex = el.dataset.prevZIndex || "";
                el.style.position = el.dataset.prevPosition || "";
            });

            setUploadBox(null);
            setButtonBox(null);
        };
    }, []);


    return (
        <>
            <Backdrop />
            {uploadBox && <HighlightStyle style={uploadBox} />}
            {buttonBox && <HighlightStyle style={buttonBox} />}
            <TutorialOverlay
                message={<span>사진을 업로드하면 AI가 가구를 자동으로<br/> 탐지해서 '나의 가구'에 등록돼요.</span>}
                position={tooltipPos}
                onPrev={onPrev}
                onNext={onNext}
            />

            <div style={{
                position: "fixed",
                top: "24px",
                right: "24px",
                display: "flex",
                zIndex: 9999,
                gap: 16
            }}>
                <CommonButton
                    type="outline"
                    bgColor={"orange"}
                    onClick={onPrev}
                    children={"이전"}
                    {...buttonProps}
                />
                <CommonButton
                    onClick={onNext}
                    children={"다음"}
                    {...buttonProps}
                />
                <button onClick={onSkip}>종료</button>
            </div>
        </>

    );
}

export default TutorialStep1;

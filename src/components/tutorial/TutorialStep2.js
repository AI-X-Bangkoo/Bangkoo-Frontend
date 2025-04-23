import React, { useEffect, useState } from "react";
import TutorialOverlay from "./TutorialOverlay";
import {
    Backdrop,
    HighlightStyle
} from "./css/Tutorial.styled";
import CommonButton from "../../common/CommonButton";

const buttonProps = {
    width: "40px",
    height: "24px",
    fontSize: "xxs",
    radius: 0,
    fontWeight: 600
};

function TutorialStep2({ phase, onNext, onPrev, onSkip }) {
    const [firstBoxRect, setFirstBoxRect] = useState(null);
    const [generateBtnRect, setGenerateBtnRect] = useState(null);
    const [previewBox, setPreviewBox] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });


    useEffect(() => {
        const firstBox = document.querySelector(".furniture-item.first-item");
        const preview = document.querySelector(".preview-area");

        if (preview) {
            const rect = preview.getBoundingClientRect();
            setPreviewBox({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height,
            });
        }

        if (phase === "2.1" && firstBox) {
            const rect = firstBox.getBoundingClientRect();
            setFirstBoxRect({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height,
            });
            setTooltipPos({
                top: rect.bottom + 15,
                left: rect.left + rect.width / 2 ,
            });
        }

        if (phase === "2.2") {
            // ⏳ render 완료 이후에 접근
            requestAnimationFrame(() => {
                const generateBtn = document.querySelector(".generate-image-button");
                if (generateBtn) {
                    const rect = generateBtn.getBoundingClientRect();
                    setGenerateBtnRect({
                        top: rect.top + window.scrollY,
                        left: rect.left + window.scrollX,
                        width: rect.width,
                        height: rect.height,
                    });
                    setTooltipPos({
                        top: rect.bottom + 15,
                        left: rect.left + rect.width / 2 - 100,
                    });
                }
            });
        }
    }, [phase]);

    useEffect(() => {
        const firstBox = document.querySelector(".furniture-item.first-item");
        const preview = document.querySelector(".preview-area");
        const generateBtn = document.querySelector(".generate-image-button");

        const elementsToElevate = [];

        if (["1.1", "1.2", "2.1", "2.2", "2.3"].includes(phase) && preview) elementsToElevate.push(preview);
        if (phase === "2.1" && firstBox) elementsToElevate.push(firstBox);
        if (phase === "2.2" && generateBtn) elementsToElevate.push(generateBtn);

        elementsToElevate.forEach(el => {
            el.dataset.prevZIndex = el.style.zIndex;
            el.dataset.prevPosition = el.style.position;
            el.style.zIndex = "9999";
            el.style.position = "relative";
        });

        return () => {
            elementsToElevate.forEach(el => {
                el.style.zIndex = el.dataset.prevZIndex || "";
                el.style.position = el.dataset.prevPosition || "";
            });
        };
    }, [phase]);

    return (
        <>
            <Backdrop />

            {/* 항상 강조되는 preview-area */}
            {previewBox && <HighlightStyle style={previewBox} />}

            {/* 단계별 강조 박스 */}
            {phase === "2.1" && firstBoxRect && <HighlightStyle style={firstBoxRect} />}
            {phase === "2.2" && generateBtnRect && <HighlightStyle style={generateBtnRect} />}

            {/* 툴팁 */}
            {phase === "2.1" && firstBoxRect && (
                <TutorialOverlay
                    message={<span>가구를 삭제해보세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                />
            )}
            {phase === "2.2" && generateBtnRect && (
                <TutorialOverlay
                    message={<span>이미지 생성 버튼을 눌러주세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                />
            )}

            {/* 상단 네비게이션 */}
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
                    children="이전"
                    {...buttonProps}
                />
                <CommonButton
                    onClick={onNext}
                    children="다음"
                    {...buttonProps}
                />
                <button onClick={onSkip}>종료</button>
            </div>
        </>
    );
}

export default TutorialStep2;

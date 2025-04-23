import React, { useEffect, useState } from "react";
import TutorialOverlay from "./TutorialOverlay";
import {
    Backdrop,
    HighlightStyle
} from "./css/Tutorial.styled";
import CommonButton from "@/common/CommonButton";

const buttonProps = {
    width: "40px",
    height: "24px",
    fontSize: "xxs",
    radius: 0,
    fontWeight: 600
};

function TutorialStep6({ phase, onNext, onPrev, onSkip }) {
    const [highlightRects, setHighlightRects] = useState({});
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

    // zIndex 적용
    useEffect(() => {
        const preview = document.querySelector(".preview-area");
        const saveBtn = document.querySelector(".save-button");
        const descInput = document.querySelector(".interior-desc-input");
        const dialogSubmit = document.querySelector(".dialog-submit-button");
        const interiorTab = document.querySelector(".tab-interior");
        const interiorItem = document.querySelector(".interior-item");

        const elevateEls = [];

        if (["6.1", "6.3", "6.4"].includes(phase)) {
            if (preview) elevateEls.push(preview);
        }
        if (phase === "6.1" && saveBtn) elevateEls.push(saveBtn);
        if (phase === "6.2" && descInput) elevateEls.push(descInput);
        if (phase === "6.2" && dialogSubmit) elevateEls.push(dialogSubmit);
        if (phase === "6.3" && interiorTab) elevateEls.push(interiorTab);
        if (phase === "6.4" && interiorItem) elevateEls.push(interiorItem);

        elevateEls.forEach(el => {
            el.dataset.prevZIndex = el.style.zIndex;
            el.dataset.prevPosition = el.style.position;
            el.style.zIndex = "1500";
            el.style.position = "relative";
        });

        return () => {
            elevateEls.forEach(el => {
                el.style.zIndex = el.dataset.prevZIndex || "";
                el.style.position = el.dataset.prevPosition || "";
            });
        };
    }, [phase]);

    // 위치 계산
    useEffect(() => {
        const getRects = () => {
            const preview = document.querySelector(".preview-area");
            const saveBtn = document.querySelector(".save-button");
            const descInput = document.querySelector(".interior-desc-input");
            const dialogSubmit = document.querySelector(".dialog-submit-button");
            const interiorTab = document.querySelector(".tab-interior");
            const interiorItem = document.querySelector(".interior-item");

            const rects = {};

            if (preview) rects.preview = preview.getBoundingClientRect();
            if (saveBtn) rects.save = saveBtn.getBoundingClientRect();
            if (descInput) rects.input = descInput.getBoundingClientRect();
            if (dialogSubmit) rects.submit = dialogSubmit.getBoundingClientRect();
            if (interiorTab) rects.tab = interiorTab.getBoundingClientRect();
            if (interiorItem) rects.item = interiorItem.getBoundingClientRect();

            setHighlightRects(rects);

            switch (phase) {
                case "6.1":
                    if (saveBtn) {
                        setTooltipPos({
                            top: rects.save.top + 60,
                            left: rects.save.left + rects.save.width / 2 - 80
                        });
                    }
                    break;
                case "6.2":
                    if (dialogSubmit) {
                        setTooltipPos({
                            top: rects.submit.top + 55,
                            left: rects.submit.left + rects.submit.width / 2 - 135
                        });
                    }
                    break;
                case "6.3":
                    if (interiorTab) {
                        setTooltipPos({
                            top: rects.tab.top - 60,
                            left: rects.tab.left + rects.tab.width / 2 - 100
                        });
                    }
                    break;
                default:
                    break;
            }
        };

        getRects();
        const interval = setInterval(getRects, 500);
        return () => clearInterval(interval);
    }, [phase]);

    const highlight = (rect) =>
        rect && (
            <HighlightStyle
                style={{
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height,
                    zIndex: 1600
                }}
            />
        );

    return (
        <>
            <Backdrop style={{ zIndex: 1300, pointerEvents: "none"  }} />

            {phase === "6.1" && highlightRects.save && highlight(highlightRects.save)}
            {phase === "6.2" && highlightRects.input && highlight(highlightRects.input)}
            {phase === "6.2" && highlightRects.submit && highlight(highlightRects.submit)}
            {phase === "6.3" && highlightRects.tab && highlight(highlightRects.tab)}
            {phase === "6.4" && highlightRects.item && highlight(highlightRects.item)}

            {/* 툴팁 */}
            {phase === "6.1" && (
                <TutorialOverlay
                    message={<span>저장버튼을 눌러주세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                    style={{ zIndex: 1500 }}
                />
            )}
            {phase === "6.2" && (
                <TutorialOverlay
                    message={<span>간단한 설명을 입력 후 저장버튼을 눌러주세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                    style={{ zIndex: 9999 }}
                />
            )}
            {phase === "6.3" && (
                <TutorialOverlay
                    message={<span>내 인테리어 탭을 눌러 저장된 사진을 확인하세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                    style={{ zIndex: 1500 }}
                />
            )}

            {/* 상단 네비게이션 */}
            <div
                style={{
                    position: "fixed",
                    top: "24px",
                    right: "24px",
                    display: "flex",
                    zIndex: 2000,
                    gap: 16,
                    pointerEvents: "auto !important"
                }}
            >
                <CommonButton
                    type="outline"
                    bgColor="orange"
                    onClick={onPrev}
                    children="이전"
                    {...buttonProps}
                />
                <CommonButton onClick={onNext} children="다음" {...buttonProps} />
                <button onClick={onSkip}>종료</button>
            </div>
        </>
    );
}

export default TutorialStep6;

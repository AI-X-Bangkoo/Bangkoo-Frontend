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
    const [highlightRects, setHighlightRects] = useState({});
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const getRects = () => {
            const preview = document.querySelector(".preview-area");
            const firstBox = document.querySelector(".furniture-item.first-item");

            const rects = {};
            if (preview) rects.preview = preview.getBoundingClientRect();
            if (firstBox) rects.firstItem = firstBox.getBoundingClientRect();

            setHighlightRects(rects);

            if (phase === "2.1" && firstBox) {
                setTooltipPos({
                    top: rects.firstItem.bottom + 10,
                    left: rects.firstItem.left + rects.firstItem.width / 2 - 80
                });
            }

            if (phase === "2.3" && preview) {
                setTooltipPos({
                    top: rects.preview.bottom + 12,
                    left: rects.preview.left + rects.preview.width / 2 - 120
                });
            }
        };

        getRects();
        const interval = setInterval(getRects, 500);
        return () => clearInterval(interval);
    }, [phase]);

    useEffect(() => {
        const preview = document.querySelector(".preview-area");
        const firstBox = document.querySelector(".furniture-item.first-item");

        const elevateEls = [];
        if (["2.1", "2.3"].includes(phase) && preview) elevateEls.push(preview);
        if (phase === "2.1" && firstBox) elevateEls.push(firstBox);

        elevateEls.forEach(el => {
            el.dataset.prevZIndex = el.style.zIndex;
            el.dataset.prevPosition = el.style.position;
            el.style.zIndex = "9999";
            el.style.position = "relative";
        });

        return () => {
            elevateEls.forEach(el => {
                el.style.zIndex = el.dataset.prevZIndex || "";
                el.style.position = el.dataset.prevPosition || "";
            });
        };
    }, [phase]);

    const highlight = (rect) =>
        rect && (
            <HighlightStyle
                style={{
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height
                }}
            />
        );

    return (
        <>
            <Backdrop style={{ zIndex: 1300 }} />

            {phase === "2.1" && highlightRects.preview && highlight(highlightRects.preview)}
            {phase === "2.1" && highlightRects.firstItem && highlight(highlightRects.firstItem)}

            {phase === "2.3" && highlightRects.preview && highlight(highlightRects.preview)}

            {phase === "2.1" && (
                <TutorialOverlay
                    message={<span>가구를 삭제해보세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                />
            )}

            {phase === "2.3" && (
                <TutorialOverlay
                    message={<span>AI가 배치한 결과를 확인하세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                />
            )}

            <div
                style={{
                    position: "fixed",
                    top: "24px",
                    right: "24px",
                    display: "flex",
                    zIndex: 9999,
                    gap: 16
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

export default TutorialStep2;
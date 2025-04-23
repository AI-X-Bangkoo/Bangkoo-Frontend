import React, { useEffect, useState } from "react";
import TutorialOverlay from "./TutorialOverlay";
import {
    Backdrop,
    HighlightStyle,
    FixedMessage
} from "./css/Tutorial.styled";
import CommonButton from "@/common/CommonButton";

const buttonProps = {
    width: "40px",
    height: "24px",
    fontSize: "xxs",
    borderRadius: 0,
    fontWeight: 600
};

function TutorialStep3({ phase, onNext, onPrev, onSkip }) {
    const [highlightRects, setHighlightRects] = useState({});
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const getRects = () => {
            const searchBtn = document.querySelector(".search-button");
            const drawer = document.querySelector(".SearchDrawer");
            const resultItem = document.querySelector(".common-image-box");
            const placeBtn = document.querySelector(".place-button");
            const preview = document.querySelector(".preview-area");
            const lastItem = document.querySelector(".furniture-item.last-item");

            const rects = {};
            if (searchBtn) rects.searchBtn = searchBtn.getBoundingClientRect();
            if (drawer) rects.drawer = drawer.getBoundingClientRect();
            if (resultItem) rects.result = resultItem.getBoundingClientRect();
            if (placeBtn) rects.place = placeBtn.getBoundingClientRect();
            if (preview) rects.preview = preview.getBoundingClientRect();
            if (lastItem) rects.lastItem = lastItem.getBoundingClientRect();

            setHighlightRects(rects);

            if (phase === "3.1" && searchBtn) {
                setTooltipPos({
                    top: rects.searchBtn.bottom + 10,
                    left: rects.searchBtn.left + rects.searchBtn.width / 2 - 60
                });
            }
            if (phase === "3.4" && resultItem) {
                setTooltipPos({
                    top: rects.result.top - 55,
                    left: rects.result.left + rects.result.width / 2 - 100
                });
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
            {/* 공통 Backdrop */}
            <Backdrop style={{ zIndex: 1200 }} />

            {/* 강조 영역 */}
            {phase === "3.1" && highlightRects.searchBtn && highlight(highlightRects.searchBtn)}
            {phase === "3.3" && highlightRects.drawer && highlight(highlightRects.drawer)}
            {phase === "3.4" && highlightRects.result && highlight(highlightRects.result)}
            {phase === "3.4" && highlightRects.place && highlight(highlightRects.place)}
            {phase === "3.5" && highlightRects.preview && highlight(highlightRects.preview)}
            {phase === "3.5" && highlightRects.lastItem && highlight(highlightRects.lastItem)}

            {/* 문구 / 툴팁 */}
            {phase === "3.2" && (
                <FixedMessage>검색어를 입력해주세요</FixedMessage>
            )}
            {phase === "3.4" && (
                <TutorialOverlay
                    message={<span>배치하고자 하는 가구에 체크해주세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
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
                    gap: 16
                }}
            >
                <CommonButton type="outline" bgColor="orange" onClick={onPrev} {...buttonProps}>
                    이전
                </CommonButton>
                <CommonButton onClick={onNext} {...buttonProps}>다음</CommonButton>
                <button onClick={onSkip}>종료</button>
            </div>
        </>
    );
}

export default TutorialStep3;

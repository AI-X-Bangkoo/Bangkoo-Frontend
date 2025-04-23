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
            const generateBtn = document.querySelector(".generate-image-button");

            const rects = {};
            if (preview) rects.preview = preview.getBoundingClientRect();
            if (firstBox) rects.firstItem = firstBox.getBoundingClientRect();
            if (generateBtn) rects.generate = generateBtn.getBoundingClientRect();

            setHighlightRects(rects);

            // 툴팁 위치 설정
            if (phase === "2.1" && firstBox) {
                setTooltipPos({
                    top: rects.firstItem.bottom + 10,
                    left: rects.firstItem.left + rects.firstItem.width / 2 - 80
                });
            }

            if (phase === "2.2" && generateBtn) {
                setTooltipPos({
                    top: rects.generate.bottom + 10,
                    left: rects.generate.left + rects.generate.width / 2 - 100
                });
            }

            if (phase === "2.4" && preview) {
                setTooltipPos({
                    top: rects.preview.bottom + 12,
                    left: rects.preview.left + rects.preview.width / 2 - 120
                });
            }

            // 2.3에서는 강조 없이 툴팁/하이라이트 모두 제거
            if (phase === "2.3") {
                setHighlightRects({});
            }
        };

        getRects();
        const interval = setInterval(getRects, 500);
        return () => clearInterval(interval);
    }, [phase]);

    // zIndex 적용
    useEffect(() => {
        const preview = document.querySelector(".preview-area");
        const firstBox = document.querySelector(".furniture-item.first-item");
        const generateBtn = document.querySelector(".generate-image-button");

        const elevateEls = [];
        if (["2.1", "2.2", "2.4"].includes(phase) && preview) elevateEls.push(preview);
        if (phase === "2.1" && firstBox) elevateEls.push(firstBox);
        if (phase === "2.2" && generateBtn) elevateEls.push(generateBtn);

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
            {/* ✅ 다이얼로그보다 뒤로 가야 하므로 2.3일 때 zIndex 낮게 */}
            <Backdrop style={{ zIndex: phase === "2.3" ? 1000 : 1300 }} />

            {/* ✅ 공통 강조 영역 */}
            {(phase === "2.1" || phase === "2.2" || phase === "2.4") &&
                highlightRects.preview &&
                highlight(highlightRects.preview)}

            {/* ✅ 2.1: 첫 번째 가구 강조 */}
            {phase === "2.1" && highlightRects.firstItem && highlight(highlightRects.firstItem)}

            {/* ✅ 2.2: 이미지 생성 버튼 강조 */}
            {phase === "2.2" && highlightRects.generate && highlight(highlightRects.generate)}

            {/* ✅ 툴팁 */}
            {phase === "2.1" && (
                <TutorialOverlay
                    message={<span>가구를 삭제해보세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                />
            )}
            {phase === "2.2" && (
                <TutorialOverlay
                    message={<span>이미지 생성 버튼을 눌러주세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                />
            )}
            {phase === "2.4" && (
                <TutorialOverlay
                    message={<span>AI가 배치한 결과를 확인하세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                />
            )}

            {/* ✅ 상단 네비게이션 */}
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

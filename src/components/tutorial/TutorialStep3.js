import React, { useEffect, useState } from "react";
import TutorialOverlay from "./TutorialOverlay";
import {
    Backdrop,
    HighlightStyle,
    FixedMessage,
} from "./css/Tutorial.styled";
import CommonButton from "@/common/CommonButton";

const buttonProps = {
    width: "40px",
    height: "24px",
    fontSize: "xxs",
    radius: 0,
    fontWeight: 600
};

function TutorialStep3({ phase, onNext, onPrev, onSkip, setTutorialStep }) {
    // 강조 영역 좌표들 저장
    const [highlightRects, setHighlightRects] = useState({});
    // 툴팁 위치 상태
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    // 3.2단계에서 입력 텍스트 표시 관련
    const [showFixedMessage, setShowFixedMessage] = useState(false);
    const [typedMessage, setTypedMessage] = useState("");

    // Step3 시작 시 전체 페이지 스크롤 방지
    useEffect(() => {
        if (phase?.startsWith("3")) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [phase]);

    // 3.4: 마지막 가구 위치 계산 + 스크롤 자동 이동 + 툴팁 위치 지정
    useEffect(() => {
        const updateRects = () => {
            const lastFurniture = document.querySelector(".furniture-item:last-child");
            if (!lastFurniture) return;

            const rect = lastFurniture.getBoundingClientRect();

            setHighlightRects(prev => ({
                ...prev,
                lastFurniture: rect
            }));

            if (phase === "3.4") {
                setTooltipPos({
                    top: rect.top + window.scrollY - 48,
                    left: rect.left + window.scrollX + rect.width / 2 - 100
                });
            }
        };

        const scrollContainer = document.querySelector(".grid-container");

        if (phase === "3.4") {
            updateRects();
            setTimeout(updateRects, 0);
            window.addEventListener("resize", updateRects);
            scrollContainer?.addEventListener("scroll", updateRects);
        }

        return () => {
            if (phase === "3.4") {
                window.removeEventListener("resize", updateRects);
                scrollContainer?.removeEventListener("scroll", updateRects);
            }
        };
    }, [phase]);

    // 단계별 강조 요소 위치 계산 및 강조 처리
    useEffect(() => {
        const updateRects = () => {
            const searchBtn = document.querySelector(".search-button");
            const drawer = document.querySelector(".drawer-root");
            const firstResult = document.querySelector(".first-result");
            const preview = document.querySelector(".preview-area");
            const lastFurniture = document.querySelector(".furniture-item:last-child");
            const placeBtn = document.querySelector(".place-button");
            const generateBtn = document.querySelector(".generate-image-button");
            const furnitureGrid = document.querySelector(".grid-container");

            const rects = {};
            if (searchBtn) rects.searchBtn = searchBtn.getBoundingClientRect();
            if (drawer) rects.drawer = drawer.getBoundingClientRect();
            if (firstResult) rects.firstResult = firstResult.getBoundingClientRect();
            if (preview) rects.preview = preview.getBoundingClientRect();
            if (lastFurniture) rects.lastFurniture = lastFurniture.getBoundingClientRect();
            if (placeBtn) rects.placeBtn = placeBtn.getBoundingClientRect();
            if (generateBtn) rects.generateBtn = generateBtn.getBoundingClientRect();

            setHighlightRects(rects);

            // 3.3: 결과 리스트 강조 및 툴팁 위치
            if (phase === "3.3" && rects.firstResult) {
                setTooltipPos({
                    top: rects.firstResult.top + window.scrollY + rects.firstResult.height + 15,
                    left: rects.firstResult.left + window.scrollX + rects.firstResult.width / 2 - 100
                });
            }

            // 3.5: 이미지 생성 버튼 툴팁 위치 설정
            if (phase === "3.5" && rects.generateBtn) {
                setTooltipPos({
                    top: rects.generateBtn.top + window.scrollY + rects.generateBtn.height + 12,
                    left: rects.generateBtn.left + window.scrollX + rects.generateBtn.width / 2 - 100
                });
            }

            // 3.4: 가구 리스트/미리보기 강조 + 마지막 항목으로 스크롤
            if (phase === "3.4") {
                if (furnitureGrid) {
                    furnitureGrid.style.zIndex = "1600";
                    furnitureGrid.style.position = "relative";
                }
                if (preview) {
                    preview.style.zIndex = "1600";
                    preview.style.position = "relative";
                }

                const scrollContainer = document.querySelector(".grid-container");
                if (lastFurniture && scrollContainer) {
                    scrollContainer.scrollTo({
                        top: lastFurniture.offsetTop - scrollContainer.offsetTop,
                        behavior: "smooth"
                    });
                }
            }

            // 3.5: 마지막 가구 숨김 처리 + 버튼 zIndex 위로
            if (phase === "3.5") {
                if (lastFurniture) {
                    // 강제로 display를 none 했다가 block 하면 다시 stacking context 초기화됨
                    lastFurniture.style.display = "none";
                    setTimeout(() => {
                        lastFurniture.style.display = "block";
                        lastFurniture.style.zIndex = "0";
                        lastFurniture.style.position = "relative";
                    }, 0);
                }
                if (generateBtn) {
                    generateBtn.dataset.prevZIndex = generateBtn.style.zIndex;
                    generateBtn.dataset.prevPosition = generateBtn.style.position;
                    generateBtn.style.zIndex = "1400"; // Backdrop 위로
                    generateBtn.style.position = "relative";
                } else {
                    generateBtn.style.zIndex = generateBtn.dataset.prevZIndex || "";
                    generateBtn.style.position = generateBtn.dataset.prevPosition || "";
                }
            }
        };

        updateRects();
    }, [phase]);

    // 각 단계별로 강조 요소들 zIndex 조정
    useEffect(() => {
        const searchBtn = document.querySelector(".search-button");
        const preview = document.querySelector(".preview-area");
        const firstResult = document.querySelector(".first-result");
        const placeBtn = document.querySelector(".place-button");
        const drawer = document.querySelector(".drawer-root");
        const lastFurniture = document.querySelector(".furniture-item:last-child");
        const furnitureGrid = document.querySelector(".grid-container");
        const generateBtn = document.querySelector(".generate-image-button");

        // 3.1: 검색버튼만 강조
        if (phase === "3.1" && searchBtn) {
            searchBtn.dataset.prevZIndex = searchBtn.style.zIndex;
            searchBtn.style.zIndex = "2000";
        } else if (searchBtn) {
            searchBtn.style.zIndex = searchBtn.dataset.prevZIndex || "";
        }

        // 3.4 이외에는 기본 상태로 복원
        if (phase !== "3.4") {
            if (furnitureGrid) {
                furnitureGrid.style.zIndex = furnitureGrid.dataset.prevZIndex || "";
                furnitureGrid.style.position = furnitureGrid.dataset.prevPosition || "";
            }
            if (preview) {
                preview.style.zIndex = preview.dataset.prevZIndex || "";
                preview.style.position = preview.dataset.prevPosition || "";
            }
        }

        if (phase !== "3.5" && generateBtn) {
            generateBtn.style.zIndex = generateBtn.dataset.prevZIndex || "";
            generateBtn.style.position = generateBtn.dataset.prevPosition || "";
        }

        // 단계에 따라 강조할 요소 리스트 구성
        const elevateEls = [];
        if (phase === "3.3") {
            if (firstResult) elevateEls.push(firstResult);
            if (placeBtn) elevateEls.push(placeBtn);
        }
        if (phase === "3.5" && preview) {
            elevateEls.push(preview);
            if (lastFurniture) elevateEls.push(lastFurniture);
            if (generateBtn) elevateEls.push(generateBtn);
        }

        elevateEls.forEach((el) => {
            el.dataset.prevZIndex = el.style.zIndex;
            el.dataset.prevPosition = el.style.position;
            el.style.zIndex = "2000";
            el.style.position = "relative";
        });

        return () => {
            elevateEls.forEach((el) => {
                el.style.zIndex = el.dataset.prevZIndex || "";
                el.style.position = el.dataset.prevPosition || "";
            });
            if (drawer) drawer.style.display = "";
        };
    }, [phase]);

    // 3.2: 타이핑 효과 보여주는 고정 메시지
    useEffect(() => {
        if (phase === "3.2") {
            setShowFixedMessage(true);
            setTypedMessage("");
            const fullText = " 검색어를 입력해주세요 ";
            let index = 0;

            const typingInterval = setInterval(() => {
                if (index >= fullText.length) {
                    clearInterval(typingInterval);
                    return;
                }
                const nextChar = fullText[index];
                setTypedMessage((prev) => prev + nextChar);
                index++;
            }, 100);

            const hideTimer = setTimeout(() => {
                setShowFixedMessage(false);

                const drawer = document.querySelector(".drawer-root");
                if (drawer) {
                    drawer.dataset.prevZIndex = drawer.style.zIndex;
                    drawer.dataset.prevPosition = drawer.style.position;
                    drawer.style.zIndex = "1600";
                    drawer.style.position = "relative";
                }
            }, 5000);

            return () => {
                clearInterval(typingInterval);
                clearTimeout(hideTimer);

                const drawer = document.querySelector(".drawer-root");
                if (drawer) {
                    drawer.style.zIndex = drawer.dataset.prevZIndex || "";
                    drawer.style.position = drawer.dataset.prevPosition || "";
                }
            };
        }
    }, [phase]);

    // 강조 박스 렌더링 유틸
    const highlight = (rect, style = {}) =>
        rect && (
            <HighlightStyle
                style={{
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                    height: rect.height,
                    zIndex: 2000,
                    ...style
                }}
            />
        );

    return (
        <>
            {phase !== "3.3" && <Backdrop style={{ zIndex: 1300 }} />}

            {phase === "3.1" && highlightRects.searchBtn && highlight(highlightRects.searchBtn)}
            {phase === "3.2" && showFixedMessage && (
                <FixedMessage>
                    <span>{typedMessage}</span>
                </FixedMessage>
            )}

            {phase === "3.3" && highlightRects.firstResult && highlight(highlightRects.firstResult)}
            {phase === "3.3" && highlightRects.placeBtn && highlight(highlightRects.placeBtn)}
            {phase === "3.3" && (
                <TutorialOverlay
                    message={<span>추가할 가구를 체크한뒤, <br />"배치" 버튼을 눌러주세요</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                    style={{ zIndex: 1500 }}
                />
            )}

            {phase === "3.4" && highlightRects.preview && highlight(highlightRects.preview)}
            {phase === "3.4" && highlightRects.lastFurniture && (
                <>
                    {highlight(highlightRects.lastFurniture, {
                        border: "3px solid orange",
                        boxShadow: "0 0 12px orange",
                        zIndex: 1700
                    })}
                    <TutorialOverlay
                        message={<span>배치할 가구를 선택해주세요</span>}
                        position={tooltipPos}
                        arrowDirection="down"
                        style={{ zIndex: 1500 }}
                    />
                </>
            )}
            {phase === "3.5" && highlightRects.preview && highlight(highlightRects.preview)}
            {phase === "3.5" && highlightRects.generateBtn && highlight(highlightRects.generateBtn)}
            {phase === "3.5" && highlightRects.generateBtn && (
                <TutorialOverlay
                    message={<span>이미지 배치 버튼을 눌러주세요.</span>}
                    position={tooltipPos}
                    arrowDirection="up"
                    style={{ zIndex: 1500 }}
                />
            )}

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
                <CommonButton
                    type="outline"
                    bgColor="orange"
                    onClick={onPrev}
                    children="이전"
                    {...buttonProps}
                />
                <CommonButton
                    onClick={() => {
                        if (phase === "3.5") setTutorialStep("6.1");
                        else onNext();
                    }}
                    children="다음"
                    {...buttonProps}
                />
                <button onClick={onSkip}>종료</button>
            </div>
        </>
    );
}

export default TutorialStep3;

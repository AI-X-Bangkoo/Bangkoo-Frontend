import React, { useEffect, useRef } from "react";
import { MainCanvas } from "./css/ImageUploader.styled";

function ImageRenderer({ imageBase64, width, height, detectedObjects, selectedIndex, onMouseDown, onMouseMove, onMouseUp,canvasRef }) {
    // const canvasRef = useRef(null);

    // const drawBox = (ctx, bbox) => {
    //     const [x, y, w, h] = bbox;
    //     ctx.strokeStyle = "red";
    //     ctx.lineWidth = 2;
    //     ctx.strokeRect(x, y, w, h);
    // };

    const drawMask = (ctx, obj) => {
        const [x, y, w, h] = obj.bbox;
        const mask = obj.mask;
        if (!mask || !mask[0]) return;

        const path = new Path2D();
        for (let j = 0; j < mask.length; j++) {
            for (let i = 0; i < mask[0].length; i++) {
                if (mask[j][i]) {
                    const px = x + (i * w) / mask[0].length;
                    const py = y + (j * h) / mask.length;
                    // 한 픽셀 단위 사각형 경계 그리기
                    path.rect(px, py, w / mask[0].length, h / mask.length);
                }
            }
        }

        ctx.strokeStyle = "red";
        ctx.lineWidth = 0.3; // 얇게
        ctx.stroke(path);    // 🟥 외곽선만 그리기
    };


    useEffect(() => {
        console.log("📦 imageBase64 (앞 100자):", imageBase64?.slice(0, 100));
        if (!imageBase64 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        console.log("🖼️ canvasRef.current:", canvasRef.current);
        console.log("🖌️ ctx:", ctx);
        const image = new Image();

        image.onload = () => {
            console.log("🎯 이미지 로드 성공!", image.width, image.height);
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.style.width = image.width + "px";
            canvas.style.height = image.height + "px";

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            console.log("🎯 이미지 drawImage 호출됨");
            console.log(selectedIndex);
            if (Array.isArray(selectedIndex)) {
                console.log("📌 배열 인덱스:", selectedIndex);
                selectedIndex.forEach((i) => {
                    const obj = detectedObjects[i];
                    if (!obj || !obj.bbox || !obj.mask) return;
                    drawMask(ctx, obj);
                    // drawBox(ctx, obj.bbox);
                });
            } else if (
                typeof selectedIndex === "number" &&
                selectedIndex >= 0 &&
                selectedIndex < detectedObjects.length
            ) {
                console.log("📌 단일 인덱스:", selectedIndex);
                const obj = detectedObjects[selectedIndex];
                if (!obj || !obj.bbox || !obj.mask) return;
                drawMask(ctx, obj);
                // drawBox(ctx, obj.bbox);
            } else {
                console.log("❗ 선택된 객체 없음, return됨");
            }
        };

        image.src = imageBase64;
    }, [imageBase64, width, height, detectedObjects, selectedIndex]);


    return <MainCanvas ref={canvasRef}
                       onMouseDown={onMouseDown}
                       onMouseMove={onMouseMove}
                       onMouseUp={onMouseUp} />;
}

export default ImageRenderer;

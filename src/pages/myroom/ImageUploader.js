import React, { useRef, useState , useEffect } from "react";
import { ReactComponent as ImageUploaderIcon } from "@/assets/images/ImageUploaderIcon.svg";
import {Text} from "@/common/Typography";
import { useDispatch } from "react-redux";
import { setInitialFurniture } from "@/features/furniture/furnitureSlice";
import {
    BlurredCanvas, BlurredWrapper,MaskCanvas,
    DeleteBox, MainCanvas,
    UploadBox,
    UploadContainer,
    UploadInput,
} from "./css/ImageUploader.styled";
import CommonButton from "@/common/CommonButton";
import ImageRenderer from "./ImageRenderer";
import axios from "axios";

function ImageUploader({canvasRef, onImageUploaded, onObjectSelect, selectedIndex, setselectedIndex}) {
    const [imageUrl, setImageUrl] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const inputRef = useRef();
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [detectedObjects, setDetectedObjects] = useState([]);
    const [imageBase64, setImageBase64] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const bgImageRef = useRef(null);
    const dispatch = useDispatch();
    const containerRef = useRef();
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !containerRef.current) return;

        // ✅ 현재 div의 실제 보이는 크기 가져오기
        const divWidth = containerRef.current.clientWidth;
        const divHeight = containerRef.current.clientHeight;
        // console.log("📏 div 영역:", divWidth, divHeight);

        const imageBitmap = await createImageBitmap(file);

        const resizedCanvas = document.createElement("canvas");
        const ctx = resizedCanvas.getContext("2d");

        // ✅ div 크기 기준으로 캔버스 크기 설정
        resizedCanvas.width = divWidth;
        resizedCanvas.height = divHeight;

        ctx.drawImage(imageBitmap, 0, 0, divWidth, divHeight);

        resizedCanvas.toBlob(async (blob) => {
            const resizedFile = new File([blob], file.name, { type: "image/jpeg" });
            setImageUrl(resizedFile);
            setPreviewUrl(URL.createObjectURL(resizedFile));

            const formData = new FormData();
            formData.append("file", resizedFile);
            formData.append("canvasWidth", divWidth);   // ⬅️ 추가
            formData.append("canvasHeight", divHeight); // ⬅️ 추가

            try {
                const res = await axios.post("http://localhost:8080/api/detect_all_base64", formData);
                const results = res.data.results.map((obj, idx) => ({
                    ...obj,
                    x: obj.bbox?.[0],
                    y: obj.bbox?.[1],
                    width: obj.bbox?.[2],
                    height: obj.bbox?.[3],
                    bbox: obj.bbox,
                    mask: obj.mask,
                    thumbIndex: idx,
                    thumbnail: res.data.thumbnails_base64[idx],
                    flipHorizontal: false,
                }));
                const filtered = smartFilterDuplicates(results, 0.5);

                setDetectedObjects(filtered);
                setImageBase64(res.data.original_image_base64);
                dispatch(setInitialFurniture(
                    filtered.map((item, index) => ({
                        id: Date.now() + index,
                        image: item.thumbnail,
                        type: "eyeOn",
                        isCustom: true,
                    }))
                ));
            } catch (error) {
                console.error("자동 업로드 또는 탐지 실패:", error);
                alert("업로드 또는 탐지 중 오류가 발생했습니다.");
            }
        }, "image/jpeg", 0.95);
    };

    // const drawBox = (ctx, bbox) => {
    //     const [x, y, w, h] = bbox;
    //     ctx.strokeStyle = "red";
    //     ctx.lineWidth = 2;
    //     ctx.strokeRect(x, y, w, h);
    // };

    const drawMaskBorder = (ctx, obj) => {
        const [x, y, w, h] = obj.bbox;
        const mask = obj.mask;
        if (!mask || mask.length === 0 || mask[0].length === 0) return;

        const rows = mask.length;
        const cols = mask[0].length;
        const dx = w / cols;
        const dy = h / rows;

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                if (!mask[j][i]) continue;

                const px = x + i * dx;
                const py = y + j * dy;

                // 상단 경계
                if (j === 0 || !mask[j - 1][i]) {
                    ctx.moveTo(px, py);
                    ctx.lineTo(px + dx, py);
                }
                // 하단 경계
                if (j === rows - 1 || !mask[j + 1][i]) {
                    ctx.moveTo(px, py + dy);
                    ctx.lineTo(px + dx, py + dy);
                }
                // 좌측 경계
                if (i === 0 || !mask[j][i - 1]) {
                    ctx.moveTo(px, py);
                    ctx.lineTo(px, py + dy);
                }
                // 우측 경계
                if (i === cols - 1 || !mask[j][i + 1]) {
                    ctx.moveTo(px + dx, py);
                    ctx.lineTo(px + dx, py + dy);
                }
            }
        }

        ctx.stroke();
    };


    useEffect(() => drawScene(), [selectedIndex, imageWidth, imageHeight]);

    const isPointInsideBox = (x, y, bbox) => {
        const [bx, by, bw, bh] = bbox;
        return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
    };


    // const drawScene = (objects = detectedObjects) => {
    //     if (!canvasRef.current || !bgImageRef.current) return;
    //     const ctx = canvasRef.current.getContext("2d");
    //     const bgImg = bgImageRef.current;
    //     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //     ctx.drawImage(bgImg, 0, 0, canvasRef.current.width, canvasRef.current.height);
    //     if (Array.isArray(selectedIndex)) {
    //         // 여러 개 선택일 경우
    //         selectedIndex.forEach((index) => {
    //             const obj = objects[index];
    //             if (!obj?.bbox || !obj?.mask) return;
    //             drawMask(ctx, obj);
    //             drawBox(ctx, obj.bbox);
    //         });
    //     } else if (typeof selectedIndex === "number" &&
    //         selectedIndex >= 0 &&
    //         selectedIndex < objects.length) {
    //         // 단일 선택일 경우
    //         console.log("else if");
    //         const obj = detectedObjects[selectedIndex];
    //         drawMask(ctx, obj);
    //         drawBox(ctx, obj.bbox);
    //     } else {
    //         console.log("return됨");
    //     }
    // };
    const drawScene = (objects = detectedObjects) => {
        console.log("drawScene", objects);
        if (!canvasRef.current || !bgImageRef.current) return;
        console.log("여기탐");
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(bgImageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        if (typeof selectedIndex === "number" && objects[selectedIndex]) {
            const obj = objects[selectedIndex];
            drawMaskBorder(ctx, obj);
            // drawBox(ctx, obj.bbox);
        }
    }



    useEffect(() => {
        if (!imageBase64 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const image = new Image();
        image.onload = () => {
            bgImageRef.current = image;
            // canvas.width = image.width;
            // canvas.height = image.height;
            setImageWidth(image.width);
            setImageHeight(image.height);

            ctx.drawImage(image, 0, 0, image.width, image.height);
        };
        image.src = imageBase64;
    }, [imageBase64]);


    // const handleMouseDown = (e) => {
    //     const rect = canvasRef.current.getBoundingClientRect();
    //     const x = e.clientX - rect.left;
    //     const y = e.clientY - rect.top;
    //
    //     for (let i = detectedObjects.length - 1; i >= 0; i--) {
    //         const [bx, by, bw, bh] = detectedObjects[i].bbox;
    //         if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) {
    //             if (selectedIndex.includes(i)) {
    //                 setDraggingIndex(i);
    //                 setOffset({ x: x - bx, y: y - by });
    //             }
    //             return;
    //         }
    //     }
    // };
    const handleMouseDown = (e) => {
        if (!canvasRef.current) {
            console.warn("⛔ canvasRef.current is null!");
            return;
        }
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = detectedObjects.length - 1; i >= 0; i--) {
            const obj = detectedObjects[i];
            if (selectedIndex.includes(i) && isPointInsideBox(x, y, obj.bbox)) {
                setDraggingIndex(i);
                setOffset({ x: x - obj.bbox[0], y: y - obj.bbox[1] });
                return;
            }
        }
    };

    // const handleMouseMove = (e) => {
    //     if (draggingIndex === null) return;
    //     const rect = canvasRef.current.getBoundingClientRect();
    //     const x = e.clientX - rect.left;
    //     const y = e.clientY - rect.top;
    //
    //     const obj = { ...detectedObjects[draggingIndex] };
    //     obj.bbox[0] = x - offset.x;
    //     obj.bbox[1] = y - offset.y;
    //
    //     setDetectedObjects((prev) => {
    //         const updated = [...prev];
    //         updated[draggingIndex] = obj;
    //         return updated;
    //     });
    //
    //     requestAnimationFrame(drawScene);
    // };
    const handleMouseMove = (e) => {
        if (!canvasRef.current) {
            console.warn("⛔ canvasRef.current is null!");
            return;
        }
        if (draggingIndex === null) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setDetectedObjects((prev) => {
            const updated = [...prev];
            const obj = { ...updated[draggingIndex] };
            obj.bbox[0] = x - offset.x;
            obj.bbox[1] = y - offset.y;
            updated[draggingIndex] = obj;
            console.log("📦 드래그 bbox", obj.bbox);
            return updated;
        });

        requestAnimationFrame(drawScene);
    };

    // const handleMouseUp = () => {
    //     setDraggingIndex(null);
    // };
    const handleMouseUp = () => {
        if (!canvasRef.current) {
            console.warn("⛔ canvasRef.current is null!");
            return;
        }
        setDraggingIndex(null);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            handleFileChange({ target: { files: e.dataTransfer.files } });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const triggerFileInput = () => {
        inputRef.current.click();
    };

    const handleDeleteImage = (e) => {
        e.stopPropagation();
        setImageUrl(null);
        onImageUploaded(false);
    };

    useEffect(() => {
        console.log("🔥 selectedIndex changed:", selectedIndex);
        drawScene();
    }, [selectedIndex,imageWidth, imageHeight]);
    useEffect(() => {
        const handleResize = () => {
            drawScene();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [detectedObjects, selectedIndex]);
    return (
        <>
            <DeleteBox>
                <CommonButton
                    width="120px"
                    height="40px"
                    fontSize="xs"
                    fontWeight={800}
                    radius="sm"
                    bgColor={!imageUrl ? "orange" : "red"}
                    type="fill"
                    onClick={!imageUrl ? triggerFileInput : handleDeleteImage}
                >
                    {!imageUrl ? "이미지 업로드" : "이미지 삭제"}
                </CommonButton>
            </DeleteBox>

            <UploadContainer
                ref={containerRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                $hasImage={!!imageUrl}
            >
                {!imageUrl ? (
                    <UploadBox>
                        <ImageUploaderIcon/>
                        <Text size="sm" $weight={600} color="grey">업로드 버튼을 눌러 이미지 파일을 선택하거나<br />마우스로 끌어오세요.</Text>
                    </UploadBox>
                ) : (
                    <>
                        <BlurredWrapper>
                            {/*<ImageRenderer imageBase64={imageBase64} width={imageWidth} height={imageHeight} />*/}
                            {/*<MaskCanvas ref={canvasRef}*/}
                            {/*            width={imageWidth}*/}
                            {/*            height={imageHeight}*/}
                            {/*            onMouseDown={handleMouseDown}*/}
                            {/*            onMouseMove={handleMouseMove}*/}
                            {/*            onMouseUp={handleMouseUp}/>*/}
                            <ImageRenderer
                                imageBase64={imageBase64}
                                width={imageWidth}
                                height={imageHeight}
                                detectedObjects={detectedObjects}
                                selectedIndices={selectedIndex}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                canvasRef={canvasRef}
                            />
                        </BlurredWrapper>

                    </>
                )}

                <UploadInput
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    // onMouseDown={handleMouseDown}
                    // onMouseMove={handleMouseMove}
                    // onMouseUp={handleMouseUp}
                    onChange={handleFileChange}
                />
            </UploadContainer>
        </>
    );
}

// function ImageRenderer({ imageBase64 }) {
//     const canvasRef = useRef(null);
//
//     useEffect(() => {
//         if (!imageBase64 || !canvasRef.current) return;
//
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         const image = new Image();
//
//         image.onload = () => {
//             canvas.width = image.width;
//             canvas.height = image.height;
//
//             // ctx.filter = "blur(20px)";
//             ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
//         };
//
//         image.src = imageBase64;
//     }, [imageBase64]);
//
//     return <MainCanvas
//         ref={canvasRef}
//     />;
//
// }


function smartFilterDuplicates(boxes, iouThreshold = 0.5) {
    const filtered = [];
    for (let i = 0; i < boxes.length; i++) {
        let shouldKeep = true;
        for (let j = 0; j < filtered.length; j++) {
            const iou = calculateIoU(boxes[i], filtered[j]);
            if (iou > iouThreshold) {
                shouldKeep = false;
                break;
            }
        }
        if (shouldKeep) {
            filtered.push(boxes[i]);
        }
    }
    return filtered;
}

function calculateIoU(boxA, boxB) {
    const xA1 = boxA.x;
    const yA1 = boxA.y;
    const xA2 = boxA.x + boxA.width;
    const yA2 = boxA.y + boxA.height;

    const xB1 = boxB.x;
    const yB1 = boxB.y;
    const xB2 = boxB.x + boxB.width;
    const yB2 = boxB.y + boxB.height;

    const interWidth = Math.max(0, Math.min(xA2, xB2) - Math.max(xA1, xB1));
    const interHeight = Math.max(0, Math.min(yA2, yB2) - Math.max(yA1, yB1));
    const interArea = interWidth * interHeight;

    const boxAArea = (xA2 - xA1) * (yA2 - yA1);
    const boxBArea = (xB2 - xB1) * (yB2 - yB1);

    const iou = interArea / (boxAArea + boxBArea - interArea);
    return iou;
}

export default ImageUploader;

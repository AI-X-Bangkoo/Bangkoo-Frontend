import React, { useRef, useState } from "react";
import { ReactComponent as ImageUploaderIcon } from "@/assets/images/ImageUploaderIcon.svg";
import {Text} from "@/common/Typography";
import {
    BlurredCanvas, BlurredWrapper,
    DeleteBox, MainCanvas,
    UploadBox,
    UploadContainer,
    UploadInput,
} from "./css/ImageUploader.styled";
import CommonButton from "@/common/CommonButton";
import axios from "axios";

function ImageUploader({onImageUploaded}) {
    const [imageUrl, setImageUrl] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const inputRef = useRef();
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [detectedObjects, setDetectedObjects] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const bgImageRef = useRef(null);
    const handleFileChange = async (e) => {
        // const file = e.target.files[0];
        // if (!file) return;
        //
        // const reader = new FileReader();
        // reader.onload = () => {
        //     setImageUrl(reader.result);
        //     onImageUploaded(true);
        // };
        // reader.readAsDataURL(file);
        //
        // e.target.value = "";
        const file = e.target.files[0];
        if (!file) return;

        const imageBitmap = await createImageBitmap(file);
        const resizedCanvas = document.createElement("canvas");
        const ctx = resizedCanvas.getContext("2d");
        resizedCanvas.width = 1024;
        resizedCanvas.height = 768;
        ctx.drawImage(imageBitmap, 0, 0, 1024, 768);

        resizedCanvas.toBlob(async (blob) => {
            const resizedFile = new File([blob], file.name, { type: "image/jpeg" });
            setImageUrl(resizedFile);
            setPreviewUrl(URL.createObjectURL(resizedFile));

            const formData = new FormData();
            formData.append("file", resizedFile);

            try {
                const res = await axios.post("http://localhost:8080/api/detect_all_base64", formData);
                console.log(res.data);
                const results = res.data.results.map((obj, idx) => ({
                    ...obj,
                    thumbIndex: idx,
                    flipHorizontal: false,
                }));

                const filtered = smartFilterDuplicates(results, 0.5);
                setDetectedObjects(filtered);
                console.log("여긴 실행됨");
                setPreviewUrl(`http://localhost:8000${res.data.final_image_url}`);
                setSelectedIndices([]);
            } catch (error) {
                console.error("자동 업로드 또는 탐지 실패:", error);
                alert("업로드 또는 탐지 중 오류가 발생했습니다.");
            }
        }, "image/jpeg", 0.95);
    };
    const drawBox = (ctx, bbox) => {
        const [x, y, w, h] = bbox;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
    };

    const drawMask = (ctx, obj) => {
        if (!obj || !obj.mask) return;
        let mask = obj.mask;
        const [x, y, w, h] = obj.bbox;
        if (obj.flipHorizontal) {
            mask = mask.map((row) => [...row].reverse());
        }
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = w;
        maskCanvas.height = h;
        const maskCtx = maskCanvas.getContext("2d");
        const imageData = maskCtx.createImageData(w, h);
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                const index = j * w + i;
                const value = mask[j][i];
                const idx = index * 4;
                imageData.data[idx] = 255;
                imageData.data[idx + 1] = 0;
                imageData.data[idx + 2] = 0;
                imageData.data[idx + 3] = value ? 120 : 0;
            }
        }
        maskCtx.putImageData(imageData, 0, 0);
        ctx.drawImage(maskCanvas, x, y);
    };
    const drawScene = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!bgImageRef.current) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImageRef.current, 0, 0);
        selectedIndices.forEach((index) => {
            if (detectedObjects[index]) {
                drawMask(ctx, detectedObjects[index]);
                drawBox(ctx, detectedObjects[index].bbox);
            }
        });
    };
    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = detectedObjects.length - 1; i >= 0; i--) {
            const [bx, by, bw, bh] = detectedObjects[i].bbox;
            if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) {
                if (selectedIndices.includes(i)) {
                    setDraggingIndex(i);
                    setOffset({ x: x - bx, y: y - by });
                }
                return;
            }
        }
    };
    const handleMouseMove = (e) => {
        if (draggingIndex === null) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const obj = { ...detectedObjects[draggingIndex] };
        obj.bbox[0] = x - offset.x;
        obj.bbox[1] = y - offset.y;

        setDetectedObjects((prev) => {
            const updated = [...prev];
            updated[draggingIndex] = obj;
            return updated;
        });

        requestAnimationFrame(drawScene);
    };

    const handleMouseUp = () => {
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
        e.stopPropagation(); // 업로드 박스 클릭 이벤트 방지
        setImageUrl(null);
        onImageUploaded(false);
    };

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
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                // onClick={triggerFileInput}
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
                            <BlurredCanvas src={imageUrl} alt="blur" />
                        </BlurredWrapper>

                        <MainCanvas src={imageUrl} alt="main" />
                    </>
                    // <PreviewImage src={imageUrl} alt="미리보기" />
                )}

                <UploadInput
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onChange={handleFileChange}
                />
            </UploadContainer>
        </>

    );

}
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

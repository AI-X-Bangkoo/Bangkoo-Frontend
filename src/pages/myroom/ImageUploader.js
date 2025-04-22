import React, { useImperativeHandle, forwardRef, useRef, useState , useEffect } from "react";
import { ReactComponent as ImageUploaderIcon } from "@/assets/images/ImageUploaderIcon.svg";
import {Text} from "@/common/Typography";
import { useDispatch } from "react-redux";
import { setInitialFurniture } from "@/features/furniture/furnitureSlice";
import {
    BlurredCanvas, BlurredWrapper,MaskCanvas,
    DeleteBox, MainCanvas,
    UploadBox,
    UploadContainer,
    UploadInput, UndoRedoBox
} from "./css/ImageUploader.styled";
import CommonButton from "@/common/CommonButton";
import ImageRenderer from "./ImageRenderer";
import axios from "axios";
import { usePlacementHistory } from "@/hooks/usePlacementHistory";
import {FaUndo, FaRedo} from "react-icons/fa";
import { useRemoveObject } from "@/hooks/useRemoveObject";

    const ImageUploader = forwardRef((props, ref) => {
        const {
            canvasRef,
            onImageUploaded,
            onObjectSelect,
            selectedIndex,
            setselectedIndex,
            resetObjectPositionRef,
            setCenterArea,
            mode, 
            setMode,
            className
        } = props;
    const [imageUrl, setImageUrl] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const inputRef = useRef();
    const [draggingIndex, setDraggingIndex] = useState(null);
    const [detectedObjects, setDetectedObjects] = useState([]);
    const [imageBase64, setImageBase64] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    // const canvasRef = useRef(null);
    const bgImageRef = useRef(null);
    const dispatch = useDispatch();
    const containerRef = useRef();
    const restoreInitialImageRef = useRef();
    const originalImageRef = useRef(null);
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);
    const { saveState, undo, redo, clearHistory } = usePlacementHistory();
    const [sessionId, setSessionId] = useState(null);
    const transformRef = useRef(null); // 🔥 transform 기억해둠
    
    const [draggingThumbnailPos, setDraggingThumbnailPos] = useState(null);
    const [finalThumbnailPos, setFinalThumbnailPos] = useState(null);
    const [clickOffsetRatio, setClickOffsetRatio] = useState({ x: 0.5, y: 0.5 });
    const [initialDragBbox, setInitialDragBbox] = useState(null);
    
    const removeObject = useRemoveObject({
        canvas: canvasRef.current,
        transform: transformRef.current,
        selectedIndex,
        detectedObjects,
        setDetectedObjects,
      });

    const drawMovingHint = (ctx, transform) => {
        if (!initialDragBbox || !transform) return;
        const [x, y, w, h] = initialDragBbox;
      
        const canvasX = x * transform.scaleX + transform.offsetX;
        const canvasY = y * transform.scaleY + transform.offsetY;
        const canvasW = w * transform.scaleX;
        const canvasH = h * transform.scaleY;
      
        // 빨간 박스
        ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        ctx.fillRect(canvasX, canvasY, canvasW, canvasH);
      };
      

      const drawScene = (objects = detectedObjects) => {
        if (!canvasRef.current || !bgImageRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
        const transform = transformRef.current;
        if (!transform) {
          console.warn("❌ transform이 비어 있음!");
          return;
        }
      
        drawImageContainWithSideBlur(bgImageRef.current, ctx, canvasRef.current, transform);
      
        // 🔸 드래그 중이면 빨간 힌트 박스 표시
        if (draggingIndex !== null && detectedObjects[draggingIndex]) {
          if (mode === "move" && initialDragBbox) {
            drawMovingHint(ctx, transform);
          }
        }
      
        // 🔸 마스크 윤곽선은 항상 original 위치 기준으로 그리기
        if (typeof selectedIndex === "number" && objects[selectedIndex]) {
          const obj = objects[selectedIndex];
          const maskTarget = mode === "move" && initialDragBbox
            ? { ...obj, bbox: initialDragBbox }  // 이동 중엔 원래 bbox로
            : obj;
          drawMaskBorder(ctx, maskTarget, transform);
        }
      };
      
        
    const drawImageContainWithSideBlur = (image, ctx, canvas,reuseTransform = null) => {
        let transform;
        if (reuseTransform) {
            const { scaleX, scaleY, offsetX, offsetY, centerArea } = reuseTransform;
            const renderableWidth = image.width * scaleX;
            const renderableHeight = image.height * scaleY;

            const blurWidth = offsetX;

            // 좌우 블러 처리 (🔥 추가해야 blur가 보임)
            if (blurWidth > 0) {
                ctx.filter = "blur(15px)";
                ctx.drawImage(
                    image,
                    0, 0, image.width * 0.05, image.height,
                    0, offsetY, blurWidth, renderableHeight
                );
                ctx.drawImage(
                    image,
                    image.width * 0.95, 0, image.width * 0.05, image.height,
                    offsetX + renderableWidth, offsetY, blurWidth, renderableHeight
                );
            }

            // 중앙 영역
            ctx.filter = "none";
            ctx.drawImage(image, offsetX, offsetY, renderableWidth, renderableHeight);
            return reuseTransform;
        }
        const canvasAspect = canvas.width / canvas.height;
        const imageAspect = image.width / image.height;

        console.log("📐 canvas size:", canvas.width, canvas.height);
        console.log("🖼️ image size:", image.width, image.height);

        let renderableWidth, renderableHeight, xStart, yStart;

        if (imageAspect > canvasAspect) {
            renderableWidth = canvas.width;
            renderableHeight = renderableWidth / imageAspect;
            xStart = 0;
            yStart = (canvas.height - renderableHeight) / 2;
        } else {
            renderableHeight = canvas.height;
            renderableWidth = renderableHeight * imageAspect;
            xStart = (canvas.width - renderableWidth) / 2;
            yStart = 0;
        }
        const blurWidth = xStart;
        // ✅ 1. 좌우 블러 처리
        if (blurWidth > 0) {
            ctx.filter = "blur(15px)";
            ctx.drawImage(image, 0, 0, image.width * 0.05, image.height, 0, yStart, blurWidth, renderableHeight);
            ctx.drawImage(image, image.width * 0.95, 0, image.width * 0.05, image.height, xStart + renderableWidth, yStart, blurWidth, renderableHeight);
        }

        ctx.filter = "none";
        ctx.drawImage(image, xStart, yStart, renderableWidth, renderableHeight);

        transform = {
            scaleX: renderableWidth / image.width,
            scaleY: renderableHeight / image.height,
            offsetX: xStart,
            offsetY: yStart,
            centerArea: {
                x: xStart,
                y: yStart,
                width: renderableWidth,
                height: renderableHeight
            },
        };

        if (setCenterArea) setCenterArea(transform.centerArea);
        return transform;
    };

        const drawMaskOnly = () => {
            if (!canvasRef.current || !bgImageRef.current || !transformRef.current) {
                console.warn("❗ 필수 요소 없음: canvas or image or transform");
                return;
            }

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const transform = transformRef.current;

            // 1. 최신 배경 이미지 유지
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawImageContainWithSideBlur(bgImageRef.current, ctx, canvas, transform);

            // 2. 선택된 마스크만 덧그리기
            if (typeof selectedIndex === "number" && detectedObjects[selectedIndex]) {
                drawMaskBorder(ctx, detectedObjects[selectedIndex], transform);
            }
        };

    useEffect(() => {
        if (resetObjectPositionRef) {
            resetObjectPositionRef.current = (index) => {
                setDetectedObjects((prev) => {
                    const updated = [...prev];
                    const obj = updated[index];
                    if (!obj || !obj.originalBbox) return prev;

                    updated[index] = {
                        ...obj,
                        bbox: [...obj.originalBbox],
                    };

                    return updated;
                });

                // ❗여기서 selectedIndex도 설정해줘야 drawScene 반응함
                setselectedIndex(index); // ✅ 이거 추가!
            };
            console.log("✅ resetObjectPositionRef 등록 완료");
        }
    }, [resetObjectPositionRef]);

    const handleUndo = async () => {
        const base64 = await undo(); // ⬅️ 훅에서 base64 받아옴
        if (!base64 || !canvasRef.current) return;
      
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
      
        const image = new Image();
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, image.width, image.height);
      
          bgImageRef.current = image;
          setImageBase64(base64); // 마스크 재렌더링 위해 base64도 갱신
        };
        image.src = base64;
      };
      
      const handleRedo = async () => {
        const base64 = await redo();
        if (!base64 || !canvasRef.current) return;
      
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
      
        const image = new Image();
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, image.width, image.height);
      
          bgImageRef.current = image;
          setImageBase64(base64);
        };
        image.src = base64;
    };
            const restoreOriginalImage = () => {
                const base64 = originalImageRef.current;
                if (!base64 || !canvasRef.current) return;

                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                const image = new Image();
                image.onload = () => {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    bgImageRef.current = image;
                    setImageBase64(base64);
                };
                image.src = base64;
            };
            useEffect(() => {
                if (restoreInitialImageRef) {
                    restoreInitialImageRef.current = restoreOriginalImage;
                }
            }, [restoreInitialImageRef]);
            useImperativeHandle(ref, () => ({
                handleFileChange,
            }));
    const applyAiImage = (aiBase64) => {
        setImageBase64(aiBase64);

        const image = new Image();
        image.onload = () => {
            bgImageRef.current = image;
            const transform = drawImageContainWithSideBlur(image, canvasRef.current.getContext("2d"), canvasRef.current);
            transformRef.current = transform;
            drawScene(); // 선택된 객체에 대해 마스크만 다시 그림
        };
        image.src = aiBase64;
    };
    const handleFileChange = async (e) => {
        // const file = e.target.files[0];
        const file = e.target?.files?.[0] || e; // e가 File이면 직접 사용
        if (!file || !containerRef.current) return;

          // ✅ 기존 세션 히스토리 삭제
        clearHistory();

        // ✅ 현재 div의 실제 보이는 크기 가져오기
        const divWidth = containerRef.current.clientWidth;
        const divHeight = containerRef.current.clientHeight;
        // console.log("📏 div 영역:", divWidth, divHeight);

        // ✅ 원본 이미지 크기 추출
        const imageBitmap = await createImageBitmap(file);
        const originalWidth = imageBitmap.width;
        const originalHeight = imageBitmap.height;

        setImageUrl(file);
        setPreviewUrl(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file); // ⬅️ 원본 그대로 전송
        formData.append("canvasWidth", originalWidth);   // ⬅️ 원본 해상도 사용
        formData.append("canvasHeight", originalHeight); // ⬅️ 원본 해상도 사용

            try {
                const res = await axios.post("http://localhost:8080/api/detect_all_base64", formData);
                originalImageRef.current = res.data.original_image_base64;
                const results = res.data.results.map((obj, idx) => ({

                    ...obj,
                    x: obj.bbox?.[0],
                    y: obj.bbox?.[1],
                    width: obj.bbox?.[2],
                    height: obj.bbox?.[3],
                    bbox: obj.bbox,
                    originalBbox: [...obj.bbox],  // ✅ 초기 위치 보존
                    mask: obj.mask,
                    thumbIndex: idx,
                    thumbnail: res.data.thumbnails_base64[idx],
                    flipHorizontal: false,
                }));
                const filtered = smartFilterDuplicates(results, 0.5);

                setDetectedObjects(filtered);
                setImageBase64(res.data.original_image_base64);

            if (!sessionId) {
                const generated = crypto.randomUUID();
                setSessionId(generated);
                console.log("🎯 생성된 세션 ID:", generated);
            }

            saveState(res.data.original_image_base64, sessionId);

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
    };

    const drawMaskBorder = (ctx, obj, transform = {
        scaleX: 1,
        scaleY: 1,
        offsetX: 0,
        offsetY: 0
    }) => {
        const [x, y, w, h] = obj.bbox;
        const mask = obj.mask;
        if (!mask || mask.length === 0 || mask[0].length === 0) return;

        const rows = mask.length;
        const cols = mask[0].length;
        const dx = w / cols;
        const dy = h / rows;

        const { scaleX, scaleY, offsetX, offsetY } = transform;

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;

        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                if (!mask[j][i]) continue;

                const px = x + i * dx;
                const py = y + j * dy;

                const canvasX = px * scaleX + offsetX;
                const canvasY = py * scaleY + offsetY;
                const canvasDX = dx * scaleX;
                const canvasDY = dy * scaleY;

                if (j === 0 || !mask[j - 1][i]) {
                    ctx.moveTo(canvasX, canvasY);
                    ctx.lineTo(canvasX + canvasDX, canvasY);
                }
                if (j === rows - 1 || !mask[j + 1][i]) {
                    ctx.moveTo(canvasX, canvasY + canvasDY);
                    ctx.lineTo(canvasX + canvasDX, canvasY + canvasDY);
                }
                if (i === 0 || !mask[j][i - 1]) {
                    ctx.moveTo(canvasX, canvasY);
                    ctx.lineTo(canvasX, canvasY + canvasDY);
                }
                if (i === cols - 1 || !mask[j][i + 1]) {
                    ctx.moveTo(canvasX + canvasDX, canvasY);
                    ctx.lineTo(canvasX + canvasDX, canvasY + canvasDY);
                }
            }
        }

        ctx.stroke();
    };



    useEffect(() => {
        if (imageBase64) drawScene();
    }, [imageBase64,selectedIndex, imageWidth, imageHeight]);

    const isPointInsideBox = (x, y, bbox,transform) => {
        const [bx, by, bw, bh] = bbox;
        const { scaleX, scaleY, offsetX, offsetY } = transform;

        const canvasX = bx * scaleX + offsetX;
        const canvasY = by * scaleY + offsetY;
        const canvasW = bw * scaleX;
        const canvasH = bh * scaleY;

        return x >= canvasX && x <= canvasX + canvasW && y >= canvasY && y <= canvasY + canvasH;
        // const [bx, by, bw, bh] = bbox;
        //
        // return x >= bx && x <= bx + bw && y >= by && y <= by + bh;
    };

    useEffect(() => {
        if (!imageBase64 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const container = containerRef.current;

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        const image = new Image();
        image.onload = () => {
            bgImageRef.current = image;
            // canvas.width = image.width;
            // canvas.height = image.height;
            setImageWidth(image.width);
            setImageHeight(image.height);
            // const transform = drawImageContainWithSideBlur(image, canvasRef.current.getContext("2d"), canvasRef.current);
            const ctx = canvas.getContext("2d");
            // transformRef.current = drawImageContainWithSideBlur(image, ctx, canvasRef.current);
            const transform = drawImageContainWithSideBlur(image, ctx, canvas);
            transformRef.current = transform;
            console.log("imageUploader : " ,image.width, image.height);
            // ctx.drawImage(image, 0, 0, image.width, image.height);
            // ctx.drawImage(bgImageRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            drawScene();
        };
        image.src = imageBase64;
        console.log("image Uploader",image.src);
    }, [imageBase64]);

    const handleMouseDown = (e) => {
        if (!canvasRef.current) {
          console.warn("⛔ canvasRef.current is null!");
          return;
        }
      
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
      
        const transform = transformRef.current;
        if (!transform) return;
      
        if (typeof selectedIndex !== "number" || selectedIndex < 0) {
          console.warn("❗ selectedIndex가 유효하지 않음:", selectedIndex);
          return;
        }
      
        const obj = detectedObjects[selectedIndex];
        const canvasX = obj.bbox[0] * transform.scaleX + transform.offsetX;
        const canvasY = obj.bbox[1] * transform.scaleY + transform.offsetY;
        const canvasW = obj.bbox[2] * transform.scaleX;
        const canvasH = obj.bbox[3] * transform.scaleY;
      
        if (x >= canvasX && x <= canvasX + canvasW && y >= canvasY && y <= canvasY + canvasH) {
          setDraggingIndex(selectedIndex);
          setOffset({
            x: x - canvasX,
            y: y - canvasY,
          });
      
          // ✅ 비율 기반 클릭 위치 계산
          const clickXRatio = (x - canvasX) / canvasW;
          const clickYRatio = (y - canvasY) / canvasH;
          setClickOffsetRatio({ x: clickXRatio, y: clickYRatio });
          setInitialDragBbox([...obj.bbox]);

          console.log("✅ 드래그 시작!", {
            index: selectedIndex,
            offsetX: x - canvasX,
            offsetY: y - canvasY,
            ratioX: clickXRatio.toFixed(2),
            ratioY: clickYRatio.toFixed(2),
          });
      
          setDraggingThumbnailPos({ x: e.clientX, y: e.clientY });
          setMode("move");
        } else {
          console.log("❌ 선택된 객체를 클릭하지 않았습니다.");
        }
      };

    const handleMouseMove = (e) => {
        if (!canvasRef.current || draggingIndex === null) return;

        const transform = transformRef.current;
        if (!transform) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const updated = [...detectedObjects];
        const obj = { ...updated[draggingIndex] };

        obj.bbox[0] = (x - offset.x - transform.offsetX) / transform.scaleX;
        obj.bbox[1] = (y - offset.y - transform.offsetY) / transform.scaleY;

        setDraggingThumbnailPos({ x: e.clientX, y: e.clientY });

        updated[draggingIndex] = obj;
        setDetectedObjects(updated);

        requestAnimationFrame(() => {
            drawScene(updated);
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

            drawImageContainWithSideBlur(bgImageRef.current, ctx, canvasRef.current, transform);
            const safeBbox = obj.originalBbox ? obj.originalBbox : obj.bbox;
            drawMaskBorder(ctx, { ...obj, bbox: obj.originalBbox}, transform);
        });
    };

    const handleMouseUp = () => {
        if (!canvasRef.current) {
            console.warn("⛔ canvasRef.current is null!");
            return;
        }
        setDraggingIndex(null);
        setDraggingThumbnailPos(null);
        setFinalThumbnailPos(draggingThumbnailPos);
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
            drawMaskOnly(); // drawScene 대신
        }, [selectedIndex]);
    useEffect(() => {
        const handleResize = () => {
            drawScene();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [detectedObjects, selectedIndex]);
    return (
        <>
            <UndoRedoBox>
                <CommonButton onClick={handleUndo}>
                    <FaUndo style={{margin: 5}}/>
                </CommonButton>
                <CommonButton onClick={handleRedo}>
                    <FaRedo style={{ margin: 5 }}/>
                </CommonButton>
            </UndoRedoBox>
            <DeleteBox>
                <CommonButton
                    className={className}
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
                className={className}
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
                    onChange={handleFileChange}
                />
{/* 🔹 드래그 중 실시간 썸네일 */}
{draggingThumbnailPos &&
  draggingIndex !== null &&
  transformRef.current &&
  (() => {
    const bbox = detectedObjects[draggingIndex].bbox;
    const width = bbox[2] * transformRef.current.scaleX;
    const height = bbox[3] * transformRef.current.scaleY;
    return (
      <img
        src={detectedObjects[draggingIndex]?.thumbnail}
        alt="drag-thumbnail"
        style={{
          position: "absolute",
          left:
            draggingThumbnailPos.x -
            canvasRef.current.getBoundingClientRect().left -
            width * clickOffsetRatio.x +
            "px",
          top:
            draggingThumbnailPos.y -
            canvasRef.current.getBoundingClientRect().top -
            height * clickOffsetRatio.y +
            "px",
          width: width + "px",
          height: height + "px",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    );
  })()}

{/* 🔹 드래그 종료 후 고정된 썸네일 */}
{finalThumbnailPos &&
  draggingIndex === null &&
  selectedIndex !== null &&
  transformRef.current &&
  canvasRef.current &&
  (() => {
    const bbox = detectedObjects[selectedIndex].bbox;
    const width = bbox[2] * transformRef.current.scaleX;
    const height = bbox[3] * transformRef.current.scaleY;
    return (
      <img
        src={detectedObjects[selectedIndex]?.thumbnail}
        alt="dropped-preview"
        style={{
          position: "absolute",
          left:
            finalThumbnailPos.x -
            canvasRef.current.getBoundingClientRect().left -
            width * clickOffsetRatio.x +
            "px",
          top:
            finalThumbnailPos.y -
            canvasRef.current.getBoundingClientRect().top -
            height * clickOffsetRatio.y +
            "px",
          width: width + "px",
          height: height + "px",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: 1,
        }}
      />
    );
  })()}

            </UploadContainer>
        </>
    );
    });



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

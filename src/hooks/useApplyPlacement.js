// ✅ 파일 위치: hooks/useApplyPlacement.js
// ✅ 작성자: 김태원
// ✅ 기능 요약: 현재 캔버스 이미지를 서버에 보내고, AI가 수정한 결과를 다시 캔버스에 반영하며 히스토리까지 저장하는 핵심 훅
import { useRef } from "react";
import { mergeCanvasImages, canvasToBlob } from '@/common/utils/canvas';
import { openImagePreview } from '@/common/utils/popup';
import { requestPlacement } from '@/api/placement';
import { usePlacementHistory } from './usePlacementHistory';
import base64ToFile from '../pages/myroom/event/base64ToFile';
import {drawImageContainWithSideBlur} from './utils/drawUtils';
import ImageUploader from "@/pages/myroom/ImageUploader";
/**
 * ✅ AI 배치 요청을 처리하는 커스텀 훅
 * @param {'add' | 'remove' | 'move'} mode - 작업 모드 (추가/삭제/이동)
 * @param {RefObject<HTMLCanvasElement>} background - 캔버스 참조
 * @param {Blob=} reference - 'add' 모드일 때만 참조 이미지 필요
 * @param {Object} canvasSize - 캔버스 사이즈 정보 (현재 사용 안 함)
 * @param {Function} setShowMask - 마스킹 UI 표시 토글 함수
 * @param {Function} setShowHelper - 헬퍼 UI 토글 함수
 */
export const useApplyPlacement = ({
  mode, background, reference, canvasSize,
  setShowMask, setShowHelper, centerArea,
  handleFileChange, imageUploaderRef
}) => {
  const transformRef = useRef(null);
  const { saveState } = usePlacementHistory();
  const extractCenterImageBlob = async (canvas, centerArea) => {
    const { x, y, width, height } = centerArea;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(x, y, width, height);
    tempCtx.putImageData(imageData, 0, 0);
    return new Promise((resolve) =>
      tempCanvas.toBlob((blob) => resolve(blob), "image/png", 1.0)
    );
  };

  const drawThumbnailOnCanvas = async (baseImage, {
    thumbnail, finalPos, offsetRatio, transform, bbox, outputSize
  }) => {

    console.log("🧾 들어온 파라미터:", {
      finalPos,
      offsetRatio,
      transform,
      bbox,
      outputSize,
    });

    const thumbImg = new Image();
    thumbImg.src = thumbnail;

    await new Promise((resolve, reject) => {
      thumbImg.onload = () => {
        console.log("✅ 썸네일 로딩 완료:", thumbImg.width, thumbImg.height);
        resolve();
      };
      thumbImg.onerror = () => {
        console.error("❌ 썸네일 로딩 실패", thumbnail);
        reject(new Error("썸네일 로드 실패"));
      };
    });

    // 🔧 캔버스 사이즈를 outputSize에 맞춤
    const canvas = document.createElement("canvas");
    canvas.width = outputSize.width;
    canvas.height = outputSize.height;
  
    const ctx = canvas.getContext("2d");
  
    // 🔄 배경 이미지 가운데 영역만 잘라서 다시 그리기
    const { x, y, width, height } = transform.centerArea;
    ctx.drawImage(baseImage, x, y, width, height, 0, 0, canvas.width, canvas.height);
  
    const thumbWidth = bbox[2] * transform.scaleX;
    const thumbHeight = bbox[3] * transform.scaleY;
  
    const tx = finalPos.x - thumbWidth * offsetRatio.x - x;
    const ty = finalPos.y - thumbHeight * offsetRatio.y - y;
  
    console.log("🖼️ 썸네일 위치 및 크기", { tx, ty, thumbWidth, thumbHeight });

    ctx.drawImage(thumbImg, tx, ty, thumbWidth, thumbHeight);
  
    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/png", 1.0)
    );
  };

  return async () => {
    setShowMask(true);
    setShowHelper(false);
    await new Promise((res) => setTimeout(res, 200));

    const canvas = background?.current;
    if (!canvas) {
      alert("캔버스를 찾을 수 없습니다.");
      return;
    }

    let blob = await extractCenterImageBlob(canvas, centerArea);

    try {
      if (mode === 'move') {
        const removeBase64 = await requestPlacement("remove", blob);
        const removeImage = new Image();
        removeImage.src = `data:image/png;base64,${removeBase64}`;

        // ✅ 이미지 로딩 완료 확인
        // await new Promise((resolve) => {
        //   removeImage.onload = () => {
        //     console.log("🟢 removeImage 로드 완료:", removeImage.width, removeImage.height);

        //     // 🔍 미리보기 확인용
        //     const win = window.open();
        //     win.document.write(`<img src="${removeImage.src}" style="max-width: 100%">`);
        //     resolve();
        //   };
        //   removeImage.onerror = () => {
        //     console.error("❌ removeImage 로딩 실패");
        //     resolve();
        //   };
        // });


        const ctx = canvas.getContext("2d");
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        const transform = drawImageContainWithSideBlur(removeImage, ctx, canvas);
        transformRef.current = transform;

        handleFileChange?.(base64ToFile(removeImage.src, "ai_removed.png"));
        await new Promise((res) => setTimeout(res, 300));

        // ✅ 썸네일 합성
        if (imageUploaderRef?.current) {
          const { thumbnail, finalThumbnailPos, clickOffsetRatio, transform, bbox, outputSize } = imageUploaderRef.current;

          if (thumbnail && finalThumbnailPos && clickOffsetRatio && transform && bbox && outputSize) {
            
            const previewWindow = window.open("", "_blank"); // 먼저 창을 띄움
            previewWindow.document.title = "합성 이미지 미리보기";
            previewWindow.document.body.innerHTML = "<p>이미지 로딩 중...</p>";
        
            blob = await drawThumbnailOnCanvas(removeImage, {
              thumbnail,
              finalPos: finalThumbnailPos,
              offsetRatio: clickOffsetRatio,
              transform,
              bbox,
              outputSize,
            });
          }
        }

        // 다시 move 모드 설정
        imageUploaderRef?.current?.setMode?.("move");
      }

      const base64 = await requestPlacement(mode, blob, reference);

      const resultImage = new Image();
      resultImage.onload = async () => {
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        const transform = drawImageContainWithSideBlur(resultImage, ctx, canvas);
        transformRef.current = transform;
        await saveState(`data:image/png;base64,${base64}`);
        handleFileChange?.(base64ToFile(resultImage.src, "ai_result.png"));
      };
      resultImage.src = `data:image/png;base64,${base64}`;

      alert(`AI ${mode} 처리 성공!`);
    } catch (err) {
      console.error(`AI 서버 ${mode} 처리 실패:`, err);
      alert("AI 서버로 전송 중 오류 발생!");
    }

    setShowMask(false);
  };
};
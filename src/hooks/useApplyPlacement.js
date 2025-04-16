// hooks/useApplyPlacement.js
import { mergeCanvasImages, canvasToBlob } from '@/common/utils/canvas';
import { openImagePreview } from '@/common/utils/popup';
import { requestPlacement } from '@/api/placement';

/**
 * mode에 따라 AI 배치를 요청하는 훅
 * @param {'add' | 'remove' | 'move'} mode - 작업 모드
 * @param {Blob} background - 배경 이미지 Blob
 * @param {Blob=} reference - reference 이미지 (add일 때만 필요)
 * @param {Object} canvasSize - 캔버스 사이즈 정보
 * @param {Function} setShowMask - 마스킹 UI 표시 함수
 */
export const useApplyPlacement = ({ mode, background, reference, canvasSize, setShowMask, setShowHelper }) => {
  return async () => {
    setShowMask(true);
    setShowHelper(false);
    await new Promise(resolve => setTimeout(resolve, 200));

    const canvas3D = document.querySelector('canvas');
    const finalCanvas = await mergeCanvasImages(background, canvas3D, canvasSize);

    openImagePreview(finalCanvas.toDataURL('image/png'));

    const blob = await canvasToBlob(finalCanvas);

    try {
      const base64 = await requestPlacement(mode, blob, reference);
      openImagePreview(`data:image/png;base64,${base64}`);
      alert(`AI ${mode} 처리 성공!`);
    } catch (err) {
      console.error(`AI 서버 ${mode} 처리 실패:`, err);
      alert('AI 서버로 전송 중 오류 발생!');
    }

    setShowMask(false);
  };
};

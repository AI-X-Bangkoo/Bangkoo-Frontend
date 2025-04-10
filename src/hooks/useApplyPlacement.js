// hooks/useApplyPlacement.js
import { mergeCanvasImages, canvasToBlob } from '@/common/utils/canvas';
import { openImagePreview } from '@/common/utils/popup';
import { requestPlacement } from '@/api/placement';

export const useApplyPlacement = ({ background, canvasSize, setShowMask }) => {
  return async () => {
    setShowMask(true);
    await new Promise(resolve => setTimeout(resolve, 200));

    const canvas3D = document.querySelector('canvas');
    const finalCanvas = await mergeCanvasImages(background, canvas3D, canvasSize);

    openImagePreview(finalCanvas.toDataURL('image/png'));

    const blob = await canvasToBlob(finalCanvas);
    try {
      const base64 = await requestPlacement('remove', blob);
      openImagePreview(`data:image/png;base64,${base64}`);
      alert('AI 배치 요청 성공!');
    } catch (err) {
      console.error('AI 서버 전송 실패:', err);
      alert('AI 서버로 전송 중 오류 발생!');
    }

    setShowMask(false);
  };
};

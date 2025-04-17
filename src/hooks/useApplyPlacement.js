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

    const canvasRef = background; // 너는 canvasRef를 넘겼으니 이게 맞음
    if (!canvasRef?.current) {
      console.error("❌ canvasRef가 비어있습니다.");
      alert("캔버스를 찾을 수 없습니다.");
      return;
    }


    const canvas = canvasRef.current;

    // ✅ 2. 캔버스 내용을 Blob으로 변환
    const blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png", 1.0)
    );

    // ✅ 3. 전송 및 결과 출력
    try {
      const base64 = await requestPlacement(mode, blob, reference);
      openImagePreview(`data:image/png;base64,${base64}`);
      alert(`AI ${mode} 처리 성공!`);
    } catch (err) {
      console.error(`AI 서버 ${mode} 처리 실패:`, err);
      alert("AI 서버로 전송 중 오류 발생!");
    }

    setShowMask(false);
  };
};

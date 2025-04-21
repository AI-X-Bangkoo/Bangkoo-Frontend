// ✅ 파일 위치: hooks/useApplyPlacement.js
// ✅ 작성자: 김태원
// ✅ 기능 요약: 현재 캔버스 이미지를 서버에 보내고, AI가 수정한 결과를 다시 캔버스에 반영하며 히스토리까지 저장하는 핵심 훅

import { mergeCanvasImages, canvasToBlob } from '@/common/utils/canvas';
import { openImagePreview } from '@/common/utils/popup';
import { requestPlacement } from '@/api/placement';
import { usePlacementHistory } from './usePlacementHistory';

/**
 * ✅ AI 배치 요청을 처리하는 커스텀 훅
 * @param {'add' | 'remove' | 'move'} mode - 작업 모드 (추가/삭제/이동)
 * @param {RefObject<HTMLCanvasElement>} background - 캔버스 참조
 * @param {Blob=} reference - 'add' 모드일 때만 참조 이미지 필요
 * @param {Object} canvasSize - 캔버스 사이즈 정보 (현재 사용 안 함)
 * @param {Function} setShowMask - 마스킹 UI 표시 토글 함수
 * @param {Function} setShowHelper - 헬퍼 UI 토글 함수
 */
export const useApplyPlacement = ({ mode, background, reference, canvasSize, setShowMask, setShowHelper }) => {
  
  // 🔸 Redis 기반 배치 히스토리 저장 함수 (undo/redo용)
  const { saveState } = usePlacementHistory();

  return async () => {
    // ✅ UI 상태 초기화
    setShowMask(true);
    setShowHelper(false);
    await new Promise(resolve => setTimeout(resolve, 200)); // 마스킹 전환 대기

    const canvasRef = background;

    if (!canvasRef?.current) {
      console.error("❌ canvasRef가 비어있습니다.");
      alert("캔버스를 찾을 수 없습니다.");
      return;
    }

    const canvas = canvasRef.current;
    console.log("mode: ", mode);
    if (!mode) {
      alert("작업 모드를 선택해주세요!");
      return;
    }

    // ✅ 1. 현재 캔버스 내용을 Blob으로 변환 (서버 전송용)
    const blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png", 1.0)
    );

    // ✅ 2. 서버에 요청 전송 및 결과 수신 (Base64 형태 이미지)
    try {
      const base64 = await requestPlacement(mode, blob, reference); // 서버에 mode별 요청 보내기

      openImagePreview(`data:image/png;base64,${base64}`); // 팝업으로 결과 이미지 미리보기

      // ✅ 3. 결과 이미지로 캔버스 덮어쓰기
      const image = new Image();
      image.onload = async () => {
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // ✅ 4. Redis 히스토리로 저장 (Undo/Redo용)
        await saveState(`data:image/png;base64,${base64}`);
      };
      image.src = `data:image/png;base64,${base64}`;

      alert(`AI ${mode} 처리 성공!`);
    } catch (err) {
      // ✅ 에러 핸들링
      console.error(`AI 서버 ${mode} 처리 실패:`, err);
      alert("AI 서버로 전송 중 오류 발생!");
    }

    // ✅ UI 상태 복구
    setShowMask(false);
  };
};

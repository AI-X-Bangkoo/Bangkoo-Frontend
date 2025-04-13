// hooks/useSaveInterior.js
import { useSelector } from "react-redux";
import { requestPlacementSave } from "@/api/placement";

export const useSaveInterior = (closeDialog) => {
  const explanation = useSelector((state) => state.interior.explanation);

  const handleSave = async () => {
    try {
      // ✅ 1. 테스트용 캔버스 생성 (진짜 이미지 생성용)
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "skyblue";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.font = "20px sans-serif";
      ctx.fillText("테스트 이미지", 30, 100);

      // ✅ 2. canvas를 Blob으로 변환
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert("Blob 생성 실패");
          return;
        }

        const formData = new FormData();
        formData.append("file", blob, "test.png");
        formData.append("explanation", explanation || "임시 설명입니다.");

        await requestPlacementSave(formData);

        alert("저장 요청 전송 완료!");
        if (closeDialog) closeDialog();
      }, "image/png");

    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return handleSave;
};

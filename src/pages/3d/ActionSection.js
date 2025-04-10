// ActionSection.js
import React from 'react';

export default function ActionSection({ background, modelUrl, canvasSize, setShowMask }) {
  const handleApply = async () => {
    setShowMask(true);
    await new Promise(resolve => setTimeout(resolve, 200));

    const canvas3D = document.querySelector('canvas');
    const bgImg = new Image();
    bgImg.src = background;

    const fgImg = new Image();
    fgImg.src = canvas3D.toDataURL('image/png');

    await Promise.all([
      new Promise(resolve => bgImg.onload = resolve),
      new Promise(resolve => fgImg.onload = resolve),
    ]);

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvasSize.width;
    finalCanvas.height = canvasSize.height;
    const ctx = finalCanvas.getContext('2d');

    ctx.drawImage(bgImg, 0, 0, finalCanvas.width, finalCanvas.height);
    ctx.drawImage(fgImg, 0, 0, finalCanvas.width, finalCanvas.height);

    // ⭐ 1. 미리보기
    const result = finalCanvas.toDataURL('image/png');
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${result}" style="max-width:100%;" />`);
    } else {
      alert("팝업이 차단되어 미리보기를 열 수 없습니다.");
    }

    // ⭐ 2. AI 서버 전송
    finalCanvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('mode','remove');
      formData.append('background', blob, 'bg.png');
      console.log(blob.size);
      console.log(formData.entries());

      try {
        const response = await fetch('http://localhost:6816/api/placement', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Server Error');

        const base64 = await response.text();
        const win = window.open();
        if (win) {
          win.document.write(`<img src="data:image/png;base64,${base64}" style="max-width:100%;" />`);
        } else {
          alert("팝업이 차단돼서 미리보기를 볼 수 없음!");
        }
        alert('AI 배치 요청 성공!');
      } catch (err) {
        console.error('AI 서버 전송 실패:', err);
        alert('AI 서버로 전송 중 오류 발생!');
      }
    }, 'image/png');

    setShowMask(false);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button
        onClick={handleApply}
        style={{
          background: '#ffda44',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        적용하기
      </button>
    </div>
  );
}

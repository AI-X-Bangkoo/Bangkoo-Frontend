// BackgroundSection.js
import React from 'react';
import BackgroundUploader from '../../common/three/BackgroundUploader';

export default function BackgroundSection({ onBackgroundLoad, onCanvasSizeUpdate, onModelUpload }) {
  const handleBackgroundLoad = (url) => {
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      onCanvasSizeUpdate({ width, height });
      onBackgroundLoad(url);
    };
    img.src = url;
  };

  const handleModelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onModelUpload(url);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <BackgroundUploader onUpload={handleBackgroundLoad} />
      <label
        style={{
          background: '#eee',
          padding: '6px 10px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginLeft: '10px',
        }}
      >
        모델 업로드
        <input type="file" accept=".glb,.gltf" onChange={handleModelUpload} style={{ display: 'none' }} />
      </label>
    </div>
  );
}

import React from 'react';

export default function ModelUploader({ onUpload }) {
    const handleModelUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onUpload(url); // 부모 컴포넌트로 업로드된 모델 URL 전달
        }
    };

    return (
        <div style={{ marginTop: '10px' }}>
            <label style={{ background: '#eee', padding: '6px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                모델 업로드
                <input type="file" accept=".glb,.gltf" onChange={handleModelUpload} style={{ display: 'none' }} />
            </label>
        </div>
    );
}

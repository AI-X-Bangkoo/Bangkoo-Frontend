import React from 'react';
import FixedBackground from '@/common/three/FixedBackground';
import CanvasWrapper from './CanvasWrapper';

export default function Canvas3DSection({ background, modelUrl, canvasSize, showMask }) {
  return (
    <div
      style={{
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
        position: 'relative',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {background && (
        <FixedBackground
          imageUrl={background}
          style={{
            objectFit: 'cover',
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
      )}
      <CanvasWrapper canvasSize={canvasSize} modelUrl={modelUrl} showMask={showMask} />
    </div>
  );
}

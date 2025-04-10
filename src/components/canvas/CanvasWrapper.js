import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Lights from './Lights';
import Controls from './Controls';
import ModelRenderer from './ModelRenderer';

export default function CanvasWrapper({ canvasSize, modelUrl, showMask }) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 4], fov: 45 }}
      gl={{ preserveDrawingBuffer: true, alpha: true }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${canvasSize.width}px`,
        height: `${canvasSize.height}px`,
        zIndex: 1,
        pointerEvents: 'auto',
      }}
    >
      <Lights />
      <Suspense fallback={null}>
        <ModelRenderer modelUrl={modelUrl} showMask={showMask} />
      </Suspense>
      <Controls />
    </Canvas>
  );
}

import React from 'react';
import { useGLTF } from '@react-three/drei';
import { useModelTransform } from './useModelTransform';
import { useEdgeEffect } from './useEdgeEffect';

export default function Model({ url, showMask }) {
  const { scene } = useGLTF(url);
  const edges = useEdgeEffect(scene, showMask);

  useModelTransform(scene);

  return (
    <>
      <primitive object={scene} dispose={null} />
      {showMask && edges.map((edge, i) => (
        <primitive key={i} object={edge} />
      ))}
    </>
  );
}

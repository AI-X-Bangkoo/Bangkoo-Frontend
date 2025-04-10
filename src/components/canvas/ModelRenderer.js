import React from 'react';
import Model from './model/Model';

export default function ModelRenderer({ modelUrl, showMask }) {
  if (!modelUrl) return null;
  return <Model url={modelUrl} showMask={showMask} />;
}

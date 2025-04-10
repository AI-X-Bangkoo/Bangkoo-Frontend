import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function useEdgeEffect(scene, showMask) {
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!showMask) {
      setEdges([]);
      return;
    }

    const newEdges = [];

    scene.traverse((child) => {
      if (child.isMesh) {
        const edgeGeo = new THREE.EdgesGeometry(child.geometry);
        const edgeMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const edge = new THREE.LineSegments(edgeGeo, edgeMat);
        edge.position.copy(child.position);
        edge.rotation.copy(child.rotation);
        edge.scale.copy(child.scale);
        newEdges.push(edge);
      }
    });

    setEdges(newEdges);

    return () => {
      newEdges.forEach(e => {
        e.geometry.dispose();
        e.material.dispose();
      });
      setEdges([]);
    };
  }, [showMask, scene]);

  return edges;
}

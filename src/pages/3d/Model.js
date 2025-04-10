// components/Model.js
import React, { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Model({ url, showMask }) {
  const { scene } = useGLTF(url);
  const { camera, controls } = useThree();
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const realWidth = 0.82;
    const box = new THREE.Box3().setFromObject(scene);
    const modelSize = new THREE.Vector3();
    box.getSize(modelSize);

    if (modelSize.x >= 5) {
      const scaleX = realWidth / modelSize.x;
      scene.scale.setScalar(scaleX);
    }

    placeModelOnGround(scene);

    const newBox = new THREE.Box3().setFromObject(scene);
    const newCenter = new THREE.Vector3();
    newBox.getCenter(newCenter);

    const maxSize = Math.max(...newBox.getSize(new THREE.Vector3()).toArray());
    const fov = camera.fov * (Math.PI / 180);
    const distance = maxSize / (2 * Math.tan(fov / 2));
    camera.position.set(newCenter.x, newCenter.y, newCenter.z + distance * 1.5);
    camera.lookAt(newCenter);

    if (controls) {
      controls.target.copy(newCenter);
      controls.update();
    }
  }, [scene, camera, controls]);

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

  return (
    <>
      <primitive object={scene} dispose={null} />
      {showMask && edges.map((edge, i) => <primitive key={i} object={edge} />)}
    </>
  );
}

function placeModelOnGround(scene) {
  const box = new THREE.Box3().setFromObject(scene);
  const yOffset = box.min.y;
  scene.position.y -= yOffset;
}

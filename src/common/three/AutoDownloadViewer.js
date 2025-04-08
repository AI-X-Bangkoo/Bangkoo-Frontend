// AutoDownloadViewer.jsx

import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AutoDownloadViewer = ({ uid }) => {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);

        // Light
        const light = new THREE.AmbientLight(0xffffff, 1);
        scene.add(light);

        camera.position.z = 2;

        // === 자동 다운로드 + 로딩 ===
        const autoDownloadAndLoad = async () => {
            try {
                const res = await fetch(`http://localhost:5000/download/${uid}`);
                const data = await res.json();
                if (!data || data.status !== 'ok') throw new Error('Download Failed');

                const modelUrl = data.model_path; // ex) /static/models/uid/scene.gltf

                const loader = new GLTFLoader();
                loader.load(modelUrl, (gltf) => {
                    scene.add(gltf.scene);
                });
            } catch (err) {
                console.error('다운로드 또는 로딩 실패', err);
            }
        };

        autoDownloadAndLoad();

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            document.body.removeChild(renderer.domElement);
        };
    }, [uid]);

    return null;
};

export default AutoDownloadViewer;
// src/components/SketchfabGLTFViewer.jsx

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const SketchfabGLTFViewer = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        let renderer, scene, camera, controls;

        const init = async () => {
            // Scene
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f0f0);

            // Camera
            camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 1, 5);

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            mountRef.current.appendChild(renderer.domElement);

            // Lights
            const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
            hemiLight.position.set(0, 20, 0);
            scene.add(hemiLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
            dirLight.position.set(-3, 10, -10);
            dirLight.castShadow = true;
            scene.add(dirLight);

            // Controls
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 1;
            controls.maxDistance = 10;

            // Resize Handler
            window.addEventListener('resize', onWindowResize);

            // Load Model
            await loadModel();

            animate();
        };

        const fetchDownloadUrl = async (uid) => {
            const API_TOKEN = process.env.REACT_APP_SKETCHFAB_API_TOKEN;
            try {
                const res = await fetch(`https://api.sketchfab.com/v3/models/${uid}/download`, {
                    headers: { 'Authorization': `Token ${API_TOKEN}` }
                });
                if (!res.ok) throw new Error("Sketchfab API 요청 실패");
                const data = await res.json();
                return data.gltf.url;
            } catch (error) {
                console.error(error);
                return null;
            }
        };

        const loadModel = async () => {
            const gltfUrl = await fetchDownloadUrl("9aea3b516d3e4e169710049b32282670");
            if (!gltfUrl) return;
            const loader = new GLTFLoader();
            loader.load(
                gltfUrl,
                (gltf) => {
                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    scene.add(gltf.scene);
                },
                undefined,
                (error) => console.error('모델 로딩 에러', error)
            );
        };

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        init();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };

    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh', background: '#f0f0f0' }} />;
};

export default SketchfabGLTFViewer;
// useThreeRenderer.js (Refactored Version)
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect, useRef } from "react";

export const useThreeRenderer = (canvasRef) => {
    const sceneRef = useRef();
    const cameraRef = useRef();
    const rendererRef = useRef();
    const modelRef = useRef();
    const controlsRef = useRef();
    const isReady = useRef(false);
    const modelMap = useRef(new Map());  // ✅ GLB 모델 캐시

    const initRenderer = () => {
        const canvas = canvasRef.current;
        if (!canvas || canvas.clientWidth === 0 || canvas.clientHeight === 0) {
            console.warn("❗ Canvas가 아직 준비되지 않음");
            return;
        }

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        console.log("client height 값 :",height);
        canvas.width = width;
        canvas.height = height;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 2, 5);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(width,height);
        renderer.setPixelRatio(window.devicePixelRatio);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(ambientLight);
        scene.add(directionalLight);

        const controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.target.set(0, 0, 0);
        controls.update();

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        controlsRef.current = controls;
        isReady.current = true;

        animate();
    };

    const animate = () => {
        requestAnimationFrame(animate);
        controlsRef.current?.update();
        rendererRef.current?.render(sceneRef.current, cameraRef.current);
    };

    const loadModel = (url,id) => {
        if (modelMap.current.has(id)) {
            const model = modelMap.current.get(id);
            model.visible = true;
            sceneRef.current.add(model);   // 다시 보여줌
            modelRef.current = model;
            focusModel();                  // 위치 재조정
            return;
        }
        if (!isReady.current || !cameraRef.current || !controlsRef.current || !sceneRef.current) {
            console.warn("❗ Renderer 초기화가 완료되지 않아 loadModel 실행 불가");
            return;
        }

        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
            const model = gltf.scene;
            console.log("✅ 모델 로드 성공:", model);

            if (modelRef.current) {
                sceneRef.current.remove(modelRef.current);
            }

            model.visible = true;
            model.position.set(0, 0, 0);

            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            if (size.length() < 0.001) {
                console.log("사이즈 작음 — 기본 스케일 적용");
                model.scale.setScalar(1);
            } else {
                const targetSize = 1.0;
                const scaleFactor = targetSize / Math.max(size.x, size.y, size.z);
                model.scale.setScalar(scaleFactor);
                // ✅ Y축 중심으로 위치 보정 (중심을 화면 정중앙에 맞추기)
                const centerY = (box.max.y + box.min.y) / 2;
                model.position.y -= centerY * scaleFactor;

                // ✅ 카메라 포지션 보정 (Y값 너무 크면 위에서 내려다보는 느낌)
                if (cameraRef.current && controlsRef.current) {
                    const camera = cameraRef.current;
                    const controls = controlsRef.current;

                    const fov = camera.fov * (Math.PI / 180);
                    const distance = targetSize / (2 * Math.tan(fov / 2));

                    camera.position.set(center.x, center.y, center.z + distance * 1.5);  // ✔ Y 높이 제거!
                    camera.lookAt(center);
                    controls.target.copy(center); // 🔥 중심 제대로 따라가게
                    controls.update();
                }
                // model.position.y -= box.min.y * scaleFactor;
            }

            const fov = cameraRef.current.fov * (Math.PI / 180);
            const distance = 1.0 / (2 * Math.tan(fov / 2));
            cameraRef.current.position.set(center.x, center.y + 1, center.z + distance * 1.5);
            cameraRef.current.lookAt(center);
            controlsRef.current.target.copy(center);
            controlsRef.current.update();

            modelMap.current.set(id, model);     // 캐시에 저장
            modelRef.current = model;
            sceneRef.current.add(model);
            focusModel();
        });
    };
    const hideModel = (id) => {
        const model = modelMap.current.get(id);
        if (model) {
            model.visible = false;
        }
    };
    const focusModel = () => {
        if (!isReady.current || !modelRef.current || !cameraRef.current || !controlsRef.current) {
            console.warn("❗ 모델 또는 렌더러 구성요소가 초기화되지 않음");
            return;
        }

        const box = new THREE.Box3().setFromObject(modelRef.current);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const fov = cameraRef.current.fov * (Math.PI / 180);
        const distance = Math.max(size.x, size.y, size.z) / (2 * Math.tan(fov / 2));

        cameraRef.current.position.set(center.x, center.y + 1, center.z + distance * 1.5);
        cameraRef.current.lookAt(center);
        controlsRef.current.target.copy(center);
        controlsRef.current.update();
    };

    const moveModel = (dx, dz) => {
        if (modelRef.current) {
            modelRef.current.position.x += dx;
            modelRef.current.position.z += dz;
        }
    };

    const zoom = (delta) => {
        if (cameraRef.current) {
            cameraRef.current.position.z += delta;
        }
    };


    return {
        initRenderer,
        loadModel,
        moveModel,
        zoom,
        focusModel,
        getCurrentModel: () => modelRef.current,
    };
};

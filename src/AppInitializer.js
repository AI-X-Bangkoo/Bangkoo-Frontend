import { useEffect, useRef } from "react";
import useAuth from "./hooks/login/useAuth";

const AppInitializer = () => {
    const { initLogin } = useAuth();
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!initializedRef.current) {
            initLogin(); // 최초 한 번만 실행
            initializedRef.current = true;
        }
    }, [initLogin]);

    return null;
};

export default AppInitializer;
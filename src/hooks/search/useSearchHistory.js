import { useSelector, useDispatch } from "react-redux";
import {
    setKeyword,
    addRecentKeyword,
    removeRecentKeyword,
    clearRecentKeywords,
    toggleAutoSave,
} from "@/features/search/searchSlice";
import useAuth from "../login/useAuth"; // 로그인 상태 확인용

export default function useSearchHistory() {
    const dispatch = useDispatch();
    const keyword = useSelector((state) => state.search.keyword);
    const recent = useSelector((state) => state.search.recentKeywords);
    const autoSave = useSelector((state) => state.search.autoSave);
    const { user } = useAuth();
    const userId = user?.userId;

    // 키워드 업데이트
    const updateKeyword = (value) => {
        dispatch(setKeyword(value));
    };

    // 키워드 저장(로그인 여부 따라 다르게 처리)
    const addKeyword = async (value) => {
        if (!autoSave || !value.trim()) return;

        if (userId) {
      
        } else {
            // 비로그인 상태 → Redux + localStorage 저장
            dispatch(addRecentKeyword(value));
        }
    };

    const removeKeyword = (id) => {
        dispatch(removeRecentKeyword(id));
    };

    const clearAll = () => {
        dispatch(clearRecentKeywords());
    };

    const toggleAuto = () => {
        dispatch(toggleAutoSave());
    };

    return {
        keyword,
        recent,
        autoSave,
        updateKeyword,
        addKeyword,
        removeKeyword,
        clearAll,
        toggleAuto,
    };
}
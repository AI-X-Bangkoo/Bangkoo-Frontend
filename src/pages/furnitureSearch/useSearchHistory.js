import { useSelector, useDispatch } from "react-redux";
import {
    setKeyword,
    addRecentKeyword,
    removeRecentKeyword,
    clearRecentKeywords,
    toggleAutoSave,
} from "../../features/search/searchSlice";

export default function useSearchHistory() {
    const dispatch = useDispatch();
    const keyword = useSelector((state) => state.search.keyword);
    const recent = useSelector((state) => state.search.recent);
    const autoSave = useSelector((state) => state.search.autoSave);

    const updateKeyword = (value) => {
        dispatch(setKeyword(value));
    };

    const addKeyword = (value) => {
        if (autoSave && value.trim()) {
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
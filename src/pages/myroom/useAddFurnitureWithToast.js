import { toast } from "react-toastify";
import CustomToast from "../../common/CustomToast";
import { useDispatch } from "react-redux";
import { addFurniture as addFurnitureAction } from "../../features/furniture/furnitureSlice";

// 토스트 포함 추가 로직
export function useAddFurnitureWithToast() {
    const dispatch = useDispatch();

    return function addFurniture(item) {
        const newItem = {
            ...item,
            id: Date.now(),
            type: "hoverMinus",
            isCustom: true,
        };

        dispatch(addFurnitureAction(newItem));

        toast(({ closeToast }) => (
            <CustomToast
                message="선택하신 가구가 내 가구에 추가되었습니다."
                closeToast={closeToast}
            />
        ), {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeButton: false,
        });
    };
}
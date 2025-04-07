import { toast } from "react-toastify";
import CustomToast from "../../common/CustomToast";

// 토스트 포함 추가 로직
export function useAddFurnitureWithToast(setMyFurnitureList) {
    return function addFurniture(item) {
        const newItem = {
            ...item,
            id: Date.now(),
            type: "hoverMinus",
            isCustom: true,
        };

        setMyFurnitureList((prev) => [...prev, newItem]);

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
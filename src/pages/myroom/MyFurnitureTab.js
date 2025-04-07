import { useDispatch, useSelector } from "react-redux";
import MyFurnitureList from "./MyFurnitureList";
import { toggleFurniture } from "../../features/furniture/furnitureSlice";

export default function MyFurnitureTab({ onCustomRemove }) {
    const dispatch = useDispatch();
    const furnitureList = useSelector((state) => state.furniture.list);

    const handleClick = (item) => {
        if (item.isCustom) {
            onCustomRemove(item);
        } else {
            dispatch(toggleFurniture(item.id));
        }
    };

    return <MyFurnitureList furnitureList={furnitureList} onPlusMinus={handleClick} />;
}
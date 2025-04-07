import { useSelector } from "react-redux";
import MyInterior from "./MyInterior";

export default function InteriorTab({ onDelete, onDeleteAll }) {
    const interiorList = useSelector((state) => state.interior.list);

    return (
        <MyInterior
            interiorList={interiorList}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
        />
    );
}
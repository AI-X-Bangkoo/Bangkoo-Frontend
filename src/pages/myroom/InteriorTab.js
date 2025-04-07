import MyInterior from "./MyInterior";

export default function InteriorTab({ interiorList, onDelete, onDeleteAll }) {
    return <MyInterior interiorList={interiorList} onDelete={onDelete} onDeleteAll={onDeleteAll} />;
}
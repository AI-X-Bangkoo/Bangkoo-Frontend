import MyFurnitureList from "./MyFurnitureList";

export default function MyFurnitureTab({ furnitureList, onPlusMinus }) {
    return <MyFurnitureList furnitureList={furnitureList} onPlusMinus={onPlusMinus} />;
}
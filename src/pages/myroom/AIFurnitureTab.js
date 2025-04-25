import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecommendedFurniture } from "../../features/furniture/recommendedSlice";
import { getRecommendations } from "../../api/AIfurniture"; 
import AIFurnitureList from "./AIFurnitureList";

export default function AIFurnitureTab({ redisKey, onPlus }) {
  const dispatch = useDispatch();
  const furnitureList = useSelector((state) => state.recommended.list);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!redisKey) return;
      const data = await getRecommendations(redisKey);
      console.log("퍼니쳐탭 에서 redis의 값을 가져오기:",data);
      dispatch(setRecommendedFurniture(data));
    };

    fetchRecommendations();
  }, [redisKey, dispatch]);

  return <AIFurnitureList furnitureList={furnitureList} onPlus={onPlus} />;
}

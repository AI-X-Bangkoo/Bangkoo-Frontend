import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecommendedFurniture } from "../../features/furniture/recommendedSlice";
import { getRecommendations } from "../../api/AIfurniture"; 
import AIFurnitureList from "./AIFurnitureList";

export default function AIFurnitureTab({ redisKey, onPlus }) {
  const dispatch = useDispatch();
  const furnitureList = useSelector((state) => state.recommended.list);

  useEffect(() => {
    console.log("현재 rediskey", redisKey);
    const fetchRecommendations = async () => {
      if (!redisKey){
        console.log("레디스 키 업음, 요청 못보냄");
        return;
      };
      const data = await getRecommendations(redisKey);
      console.log("퍼니쳐탭 에서 redis의 값을 가져오기:",data);
      dispatch(setRecommendedFurniture(data));
    };

    fetchRecommendations();
  }, [redisKey, dispatch]);

  return <AIFurnitureList furnitureList={furnitureList} onPlus={onPlus} />;
}

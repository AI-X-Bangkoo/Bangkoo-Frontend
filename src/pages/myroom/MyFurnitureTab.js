import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import MyFurnitureList from "./MyFurnitureList";
import { toggleFurniture } from "@/features/furniture/furnitureSlice";
import useCheckedFurniture from "@/hooks/furniture/useCheckedFurniture";
import { Text } from "../../common/Typography";
import { EmptyBox } from "./css/MyRoom.styled";
import { addFurniture, removeFurniture } from "../../features/furniture/furnitureSlice";
import { useApplyPlacement } from "@/hooks/useApplyPlacement";

export default function MyFurnitureTab({
  onCustomRemove,
  onSelect,
  onGlbSelect,
  setselectedIndex,
  selectedIndex,
  resetObjectPositionRef,
  mode,
  setMode,
  setTutorialStep,

  //
  setShowAiRecommended,
  canvasRef,
  centerArea,
  onTutorialAdvance,
}) {
  const dispatch = useDispatch();
  const furnitureList = useSelector((state) => state.furniture.list);

  const { uncheck } = useCheckedFurniture();

  // ✅ mode가 변경될 때마다 콘솔 출력
  useEffect(() => {
    console.log("🧠 [useEffect] mode 변경됨:", mode);
  }, [mode]);

  const handleClick = (e, item) => {
    e.stopPropagation();
    if (item.isCustom) {
      console.log(item.type);
      onCustomRemove(item);
    } else {
      console.log(item.type);
      item.type === "eyeOn"
        ? dispatch(removeFurniture(item.id))
        : dispatch(addFurniture(item.id));
    }

    // originalId 기준 → SearchDrawer 체크 해제
    if (item.originalId !== undefined) {
      uncheck(item.originalId);
    }
  };

  // const handleDelete = (item, index) => {
  //   if (Array.isArray(selectedIndex)) {
  //     if (!selectedIndex.includes(index)) {
  //       setselectedIndex((prev) => [...prev, index]);
  //     } else {
  //       resetObjectPositionRef(index);
  //     }
  //   }
  // };

  // 🔹 추후 사용될 참조 이미지 (추가 기능 대비)
  const reference = null;

  // 🔹 캔버스 사이즈 정보 (현재는 고정값 사용)
  const canvasSize = { width: 1024, height: 720 };

  const applyPlacement = useApplyPlacement({
    mode,
    background: canvasRef,
    reference,
    canvasSize,
    setShowMask: () => {},
    setShowHelper: () => {},
    centerArea,
  });

  const MyFurnitureDelete = () => {
    console.log("배치 버튼 클릭됨");
    setShowAiRecommended(true);
    applyPlacement();

    setTimeout(() => {
      // setShowAiRecommended(false);
    }, 7000);

    if (typeof onTutorialAdvance === "function") {
      onTutorialAdvance();
    }
  };

  return (
    <>
      {furnitureList.length === 0 ? (
        <EmptyBox>
          <Text size="sm" $weight={500} color="dark">
            이동 혹은 삭제할 가구를 클릭해 주세요.
          </Text>
        </EmptyBox>
      ) : (
        <MyFurnitureList
          furnitureList={furnitureList}
          onPlus={handleClick}
          setMode={setMode}
          setTutorialStep={setTutorialStep}
          onMinus={(item, index) => {
            console.log("🧹 클릭한 가구 index", index);

            if (!resetObjectPositionRef?.current) {
              console.warn("⚠️ resetObjectPositionRef가 정의되지 않았습니다.");
              return;
            }

            resetObjectPositionRef.current(index); // ✅ 원래 위치 복원

            setselectedIndex((prev) => (prev === index ? null : index));
            setTimeout(() => setselectedIndex(index), 0); // ✅ 강제 리렌더
            // setMode("remove"); // ✅ 휴지통 클릭 시 모드 설정

            MyFurnitureDelete();

            // 튜토리얼
            if (typeof setTutorialStep === "function") {
              setTutorialStep("2.2");
              console.log("🎯 튜토리얼 강제 전환 → 2.2");
            }
          }}
          onSelect={(index) => {
            if (typeof setselectedIndex === "function") {
              setselectedIndex((prev) => (prev === index ? null : index));
            }
          }}
          onGlbSelect={(item, index) => {
            if (typeof setselectedIndex === "function") {
              setselectedIndex((prev) => (prev === index ? null : index));
            }
            if (typeof onGlbSelect === "function") {
              onGlbSelect(item, index);  // ✅ 여기서 props로 받은 함수를 실행해야 MyRoom까지 전달됨
            }
            console.log("GLB 선택됨, item.image:", item.model3dUrl);
            // 👇 여기서 GLB 로딩 로직 추가하면 좋아요!
            // loadGlbIntoCanvas(item.image);
          }}
        />
      )}
    </>
  );
}

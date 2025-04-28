// 최초 작성자: 김병훈
// 내 가구에서 추가된 가구를 삭제하기 위함

import { useState } from 'react';

// 아이템을 관리하는 커스텀 훅
function useFurnitureItems(initialFurnitureList = []) {
    const [furnitureItems, setFurnitureItems] = useState(initialFurnitureList);

    // 아이템을 제거하는 함수 (이미지 링크로 필터링하여 삭제)
    const handleminus = (itemImage) => {
        const updatedList = furnitureItems.filter(item => item.image !== itemImage); // 해당 이미지 링크를 가진 아이템 제거
        setFurnitureItems(updatedList); // 상태 업데이트
    };

    return {
        furnitureItems,
        handleminus
    };
}

export default useFurnitureItems;
import React from "react";
import {CategoryBox} from "./SearchInput.styled";
import {Text} from "../../common/Typography";

function Category() {
    const items = [
        {id: 1, value: "의자"},
        {id: 2, value: "가전제품"},
        {id: 3, value: "수납"},
        {id: 4, value: "테이블"},
        {id: 5, value: "침대/매트리스"},
        {id: 6, value: "이불/베개"},
        {id: 7, value: "소파"},
        {id: 8, value: "쿠션/담요"},
        {id: 9, value: "수납"},
        {id: 10, value: "아웃도어"},
        {id: 11, value: "화분"},
        {id: 12, value: "데코"},
        {id: 13, value: "러그"},
        {id: 14, value: "조명"},
        {id: 15, value: "기타"},
    ]

    return (
        <CategoryBox>
            {items?.map((item) => (
                <Text key={item.id} size="sm" $weight={600}>{item.value}</Text>
            ))}
        </CategoryBox>
    );
}

export default Category;
import React from "react";
import {CategoryBox} from "./SearchInput.styled";
import {Text} from "../../common/Typography";

function Category() {
    const items = [
        {id: 1, value: "가전제품"},
        {id: 2, value: "의자"},
        {id: 3, value: "침대"},
        {id: 4, value: "쇼파"},
        {id: 5, value: "테이블"},
        {id: 6, value: "책장"},
        {id: 7, value: "서랍"},
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
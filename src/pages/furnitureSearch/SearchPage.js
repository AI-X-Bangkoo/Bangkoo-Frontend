import React, {useState} from "react";
import AISearchComponent from "../search/AISearchComponent";
import {GridBox, SearchRoot, SearchTermBox} from "./SearchPage.styled";
import {Text} from "../../common/Typography";
import CommonButton from "../../common/CommonButton";
import CommonImageBox from "../../common/CommonImageBox";
import TestImage from "../../assets/images/TestImage.png";

function SearchPage() {
    const list = [
        {
            id: 0,
            image: TestImage,
            link: 'https://www.ikea.com/kr/ko/p/lagan-integrated-dishwasher-40568019/',
            title: 'LAGAN 라간',
            text: '빌트인 식기세척기, 60 cm',
            price: 699000,
        },
        {
            id: 1,
            image: TestImage,
            link: 'https://www.ikea.com/kr/ko/p/lagan-integrated-dishwasher-40568019/',
            title: 'LAGAN 라간',
            text: '빌트인 식기세척기, 60 cm',
            price: 699000,
        },
        {
            id: 2,
            image: TestImage,
            link: 'https://www.ikea.com/kr/ko/p/lagan-integrated-dishwasher-40568019/',
            title: 'LAGAN 라간',
            text: '빌트인 식기세척기, 60 cm',
            price: 699000,
        },
        {
            id: 3,
            image: TestImage,
            link: 'https://www.ikea.com/kr/ko/p/lagan-integrated-dishwasher-40568019/',
            title: 'LAGAN 라간',
            text: '빌트인 식기세척기, 60 cm',
            price: 699000,
        },
        {
            id: 4,
            image: TestImage,
            link: 'https://www.ikea.com/kr/ko/p/lagan-integrated-dishwasher-40568019/',
            title: 'LAGAN 라간',
            text: '빌트인 식기세척기, 60 cm',
            price: 699000,
        },
    ]

    return (
        <SearchRoot>
            <AISearchComponent/>

            <SearchTermBox>
                <Text size="base" $weight={800}>의자 <span style={{fontWeight: 500}}>(10,500)</span></Text>
            </SearchTermBox>

            <GridBox>
                {list?.map((item) => (
                    <div key={item.id}>
                        <CommonImageBox image={item.image} type={"basic"} onLink={item.link}/>
                        <Text size="xs" $weight={800}>{item.title}</Text>
                        <Text size="xs" $weight={600}>{item.text}</Text>
                        <Text size="md" $weight={800}>₩ {item.price}</Text>
                        <CommonButton
                            width="100%"
                            height="44px"
                            fontSize="xs"
                            fontWeight={900}
                            radius="sm"
                            type="fill"
                        >
                            내방 인테리어 하러가기
                        </CommonButton>
                    </div>
                ))}
            </GridBox>

        </SearchRoot>
    );
}

export default SearchPage;
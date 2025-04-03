import React from "react";
import {StepRoot, StepRootIn, StepBox, ImageBox, TextBox} from "./Home.styled"
import { Text } from "../../common/Typography";

function StepComponent({type = 'basic', image, step, title, text}) {

    return (
        <StepRoot type={type}>
            <StepRootIn>
                <StepBox>
                    {type === 'basic' ?
                        <ImageBox>
                            <img src={image} alt=""/>
                        </ImageBox>
                    :
                        <TextBox>
                            <Text size="xl" $weight={900} color="orange">{step}</Text>
                            <Text size="lg" $weight={700}>{title}</Text>
                            <Text size="md" $weight={600}>{text}</Text>
                        </TextBox>
                    }
                </StepBox>
                <StepBox>
                    {type !== 'basic' ?
                        <ImageBox>
                            <img src={image} alt=""/>
                        </ImageBox>
                        :
                        <TextBox>
                            <Text size="xl" $weight={900} color="orange">{step}</Text>
                            <Text size="lg" $weight={700}>{title}</Text>
                            <Text size="md" $weight={600}>{text}</Text>
                        </TextBox>
                    }
                </StepBox>
            </StepRootIn>
        </StepRoot>
    );
}
export default StepComponent;
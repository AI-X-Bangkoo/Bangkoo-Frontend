import React from "react";
import {ImageBoxStyle} from "./css/CommonStyle"

function ImageBox({image}) {
    return (
        <ImageBoxStyle>

            <img src={image} alt={"가구 이미지"}/>
        </ImageBoxStyle>
    );
}
export default ImageBox;
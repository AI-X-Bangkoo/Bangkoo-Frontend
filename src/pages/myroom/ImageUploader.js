import React, { useRef, useState } from "react";

import { ReactComponent as ImageUploaderIcon } from "./../../assets/images/ImageUploaderIcon.svg";
import {Text} from "../../common/Typography";
import {
    DeleteBox,
    PreviewImage, UploadBox,
    UploadContainer,
    UploadInput,
} from "./css/ImageUploader.styled";
import CommonButton from "../../common/CommonButton";

function ImageUploader() {
    const [imageUrl, setImageUrl] = useState(null);
    const inputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);

        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            handleFileChange({ target: { files: e.dataTransfer.files } });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const triggerFileInput = () => {
        inputRef.current.click();
    };

    const handleDeleteImage = (e) => {
        e.stopPropagation(); // 업로드 박스 클릭 이벤트 방지
        setImageUrl(null);
    };

    return (
        <>
            <DeleteBox>
                <CommonButton
                    width="120px"
                    height="40px"
                    fontSize="xs"
                    fontWeight={800}
                    radius="sm"
                    bgColor={!imageUrl ? "orange" : "red"}
                    type="fill"
                    onClick={!imageUrl ? triggerFileInput : handleDeleteImage}
                >
                    {!imageUrl ? "이미지 업로드" : "이미지 삭제"}
                </CommonButton>
            </DeleteBox>

            <UploadContainer
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                // onClick={triggerFileInput}
                $hasImage={!!imageUrl}
            >
                {!imageUrl ? (
                    <UploadBox>
                        <ImageUploaderIcon/>
                        <Text size="sm" $weight={600} color="grey">업로드 버튼을 눌러 이미지 파일을 선택하거나<br />마우스로 끌어오세요.</Text>
                    </UploadBox>
                ) : (
                    <PreviewImage src={imageUrl} alt="미리보기" />
                )}

                <UploadInput
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </UploadContainer>
        </>

    );
}

export default ImageUploader;

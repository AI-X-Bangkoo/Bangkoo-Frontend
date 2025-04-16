import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    setUploadedImage,
    setSearchResults,
    setConfirmedKeyword,
    setKeyword
} from "@/features/search/searchSlice";
import { searchByImage, searchByImageUrl } from "@/api/search/search";
import {
    ImageSearchWrapper,
    ImageInputWrapper,
    ImageLinkBox,
    LineStyle,
    DropZone
} from "./css/SearchInput.styled";
import CommonButton from "@/common/CommonButton";
import {Text} from "@/common/Typography";
import CommonTextField from "@/common/CommonTextField";
import { useSelector } from "react-redux";

function ImageSearchBox({ onSearchComplete }) {
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userId = useSelector((state) => state.auth.user?.userId || "anonymous");

    const handleSearch = async () => {
        const trimmedUrl = imageUrl.trim();

        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);

                const result = await searchByImage(formData, userId);

                dispatch(setSearchResults(result));
                dispatch(setConfirmedKeyword("이미지 검색"));
                dispatch(setKeyword(""));              // 텍스트 클리어
                dispatch(setUploadedImage(null));      // 이미지 클리어
                navigate("/search");
            } else if (trimmedUrl) {
                setImageFile(null);  // 기존 파일 제거!

                dispatch(setUploadedImage(trimmedUrl));
                if (typeof onSearchComplete === "function") onSearchComplete(trimmedUrl);

                // 이미지 URL로 검색도 진행
                const result = await searchByImageUrl(trimmedUrl, userId);
                dispatch(setSearchResults(result));
                dispatch(setConfirmedKeyword("이미지 링크 검색"));
                dispatch(setKeyword(""));
                navigate("/search")
            } else {
                console.warn("🚫 검색 조건 없음: 파일도 URL도 없음");
            }
        } catch (err) {
            console.error("이미지 검색 실패:", err);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setImageFile(file);
            const localUrl = URL.createObjectURL(file);
            dispatch(setUploadedImage(localUrl));
            if (onSearchComplete) onSearchComplete(localUrl); // 드래그 업로드도 바로 닫기
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const localUrl = URL.createObjectURL(file);
            dispatch(setUploadedImage(localUrl)); // 미리보기 즉시 반영
            if (onSearchComplete) onSearchComplete(localUrl);
        }
    };

    return (
        <ImageSearchWrapper>
            <Text size="base" $weight={800}>이미지 검색</Text>

            <Text size="xxs" $weight={600}>파일 업로드</Text>

            <DropZone
                onClick={handleFileClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                $active={dragOver}
            >
                <Text size="xxs" $weight={500} color="darkGrey">
                    여기에 이미지를 드래그하거나 클릭해서 업로드
                </Text>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </DropZone>

            <ImageLinkBox>
                <LineStyle />
                <Text size="xxs" $weight={500} color="darkGrey">또는</Text>
                <LineStyle />
            </ImageLinkBox>

            <Text size="xxs" $weight={600}>이미지 링크</Text>

            <ImageLinkBox>
                <ImageInputWrapper>
                    <CommonTextField
                        placeholder="https://example.com/image.png"
                        height="34px"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        custom="outline"
                        line="grey"
                        fontSize="xxs"
                        onClearAll={() => {
                            setImageUrl("");
                        }}
                        onEnter={handleSearch}
                    />

                </ImageInputWrapper>
                <CommonButton
                    type="full"
                    width="80px"
                    height="34px"
                    onClick={handleSearch}
                    fontSize="xxs"
                >
                    검색
                </CommonButton>
            </ImageLinkBox>

        </ImageSearchWrapper>
    );
}

export default ImageSearchBox;



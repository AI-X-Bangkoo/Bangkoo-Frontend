import React, {useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    setUploadedImage,
    setSearchResults,
    setConfirmedKeyword,
    setKeyword,
    setLoading
} from "@/features/search/searchSlice";
import {
    SearchRoot,
    PreviewImage,
    InputBox,
    VoiceBox
} from "./css/SearchInput.styled"
import CommonIconButton from "@/common/CommonIconButton";
import { ReactComponent as VoiceIcon } from "@/assets/images/VoiceIcon.svg";
import { ReactComponent as SearchIcon } from "@/assets/images/SearchIcon.svg";
import { ReactComponent as MenuIcon } from "@/assets/images/MenuIcon.svg";
import { ReactComponent as ImageIcon } from "@/assets/images/ImageIcon.svg";
import CommonTextField from "@/common/CommonTextField";
import useSearchHistory from "@/hooks/search/useSearchHistory";
import { searchByText, searchImageUnified } from "@/api/search/search";
import useSearchDialog from "@/hooks/dialog/useSearchDialog";
import CommonDialog from "@/common/CommonDialog";

const SearchInputComponent = ({
                                  shadow,
                                  border,
                                  onFocus,
                                  handleClickCategory,
                                  onClickImage,
                                  imagePreviewUrl,
                                  imageFile,
                                  onClearImage,
                                  onCloseSearchTerm
        }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const recognitionRef = useRef(null); // 음성 인식 인스턴스 저장
    const isSubmittingRef = useRef(false); // 중복 방지용 ref
    const fileRef = useRef(null);

    const { keyword, updateKeyword } = useSearchHistory();
    const uploadedImage = useSelector((state) => state.search.uploadedImage);
    const [isListening, setIsListening] = useState(false); // 음성
    const userId = useSelector((state) => state.auth.user?.userId || "anonymous");
    const [inputValue, setInputValue] = useState(keyword || "");

    const {
        dialogOpen,
        dialogMessage,
        dialogTitle,
        openDialog,
        closeDialog
    } = useSearchDialog();

    const handleTextChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        updateKeyword(value); // 상태 변경
        dispatch(setKeyword(value));
    };

    const handleClearAll = () => {
        updateKeyword("");
        dispatch(setKeyword(""));
        dispatch(setUploadedImage(null)); // 상태 초기화

        if (typeof onClearImage === "function") {
            onClearImage(); // 부모에서 미리보기까지 제거되도록 연결
        }

        setInputValue(""); // input 필드 UI 초기화
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            goToSearch(e.target.value.trim());
            if (typeof onFocus === "function") {
                onCloseSearchTerm();
            }
        }
    };

    useEffect(() => {
        if (imageFile instanceof File) {
            fileRef.current = imageFile;
        } else {
            fileRef.current = null;
        }
    }, [imageFile]);

    const goToSearch = async (inputKeyword) => {

        if (isSubmittingRef.current) return; // 중복 호출 방지
        isSubmittingRef.current = true;

        const searchText = inputKeyword || keyword || "";

        // 이미지가 'File 객체'가 아니고 URL일 경우, URL 넘기기
        const imageFileFromRef = fileRef.current;
        const isFile = imageFile instanceof File;
        const isUrl = typeof uploadedImage === "string" && (uploadedImage.startsWith("http") || uploadedImage.startsWith("blob:"));
        
        if (!searchText && !uploadedImage) {
            isSubmittingRef.current = false;
            return;
        }

        try {
            dispatch(setLoading(true));

            // 검색 API 호출
            let result;

            if (uploadedImage) {
                // 이미지 기반 검색 (URL 또는 파일)
                result = await searchImageUnified({
                    imageFile: isFile ? imageFileFromRef : null,
                    imageUrl: isUrl ? uploadedImage : null,
                    query: searchText,
                    userId
                });
            }  else if (searchText) {
                // 텍스트만 있을 때
                result = await searchByText(searchText, userId);
            } else {
                isSubmittingRef.current = false;
                return;
            }

            const params = new URLSearchParams();
            if (searchText) params.append("query", searchText);
            if (uploadedImage) params.append("image", uploadedImage); // 필요 시만

            // 먼저 이동
            navigate(`/search?${params.toString()}`);

            // 잠깐 딜레이를 줘서 useEffect에서 uploadedImage를 아직 볼 수 있도록 함
            setTimeout(() => {
                dispatch(setSearchResults(result));
                dispatch(setConfirmedKeyword(searchText));
                dispatch(setKeyword(""));
                dispatch(setUploadedImage(null)); // ← 이게 너무 빨라서 문제였음
                setInputValue(""); // 텍스트 초기화
                fileRef.current = null; // 파일 초기화
                if (typeof onCloseSearchTerm === "function") onCloseSearchTerm();
            }, 300); // 300ms 정도면 충분합니다

        } catch (error) {
            console.error("검색 실패:", error);

        } finally {
            isSubmittingRef.current = false;
            dispatch(setLoading(false));
        }
    };

    const startVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            openDialog("이 브라우저는 음성 인식을 지원하지 않습니다.\n크롬을 사용해주세요.");
            return;
        }

        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = "ko-KR";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        let finalTranscript = "";

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            finalTranscript = event.results[0][0].transcript;
        };
        recognition.onend = async () => {
            setIsListening(false);
            if (finalTranscript.trim()) {
                setInputValue(finalTranscript);
                updateKeyword(finalTranscript);
                dispatch(setKeyword(finalTranscript));
                await goToSearch(finalTranscript); // 음성 입력도 검색 저장과 함께 실행
            } else {
                console.warn("🎤 음성 결과 없음");
            }
        };
        
        recognition.onerror = (event) => {
            console.error("음성 인식 오류:", event.error);
            openDialog(
                event.error === "not-allowed"
                    ? "마이크 사용 권한이 차단되었습니다. 브라우저 설정을 확인해주세요."
                    : event.error === "no-speech"
                        ? "음성이 감지되지 않았어요. 다시 시도해주세요."
                        : "음성 인식 중 문제가 발생했습니다."
            );
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <SearchRoot $shadow={shadow} $border={border} >
            <CommonIconButton
                type={"none"}
                icon={<MenuIcon/>}
                onClick={handleClickCategory}
            />
            {imagePreviewUrl && typeof imagePreviewUrl === "string" && (
                <PreviewImage src={imagePreviewUrl} alt="Preview" />
            )}
            <InputBox>
                <CommonTextField
                    fontSize="base"
                    placeholder="ex) 빨간색 모던한 의자"
                    value={inputValue}
                    onChange={handleTextChange}
                    onFocus={onFocus}
                    imagePreviewUrl={imagePreviewUrl}
                    onClearAll={handleClearAll}
                    onKeyDown={handleKeyDown}
                />
            </InputBox>

            <CommonIconButton
                type={"none"}
                icon={<ImageIcon/>}
                onClick={onClickImage}
            />
            <VoiceBox $active={isListening}>
                <CommonIconButton
                    type={"none"}
                    icon={<VoiceIcon  />}
                    onClick={startVoiceSearch}
                />
            </VoiceBox>

            <CommonIconButton
                type={"none"}
                icon={<SearchIcon />}
                onClick={() => goToSearch(inputValue)}
            />

            {dialogOpen && (
                <CommonDialog
                    open={dialogOpen}
                    onClose={closeDialog}
                    title={dialogTitle}
                    children={dialogMessage}
                    cancel={false}
                    onClose={closeDialog}
                    onClick={closeDialog}
                    confirmText="확인"
                />
            )}
        </SearchRoot>
    )
}

export default SearchInputComponent;
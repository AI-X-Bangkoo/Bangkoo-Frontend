import React, { useEffect, useState, useRef } from "react";
import TutorialStart from "./TutorialStart";
import TutorialStep1 from "./TutorialStep1";
import TutorialStep2 from "./TutorialStep2";

function TutorialManager({ isImageUploaded, forceStart, onStepChange }) {
    const [step, setStep] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const hasForced = useRef(false);

    const updateStep = (newStep) => {
        setStep(newStep);
        if (typeof onStepChange === "function") {
            onStepChange(newStep);
        }
    };

    // 강제로 튜토리얼 시작 요청 시
    useEffect(() => {
        if (forceStart && !hasForced.current) {
            hasForced.current = true;
            setIsRunning(true);
            updateStep("0");
        }
    }, [forceStart]);

    // 처음 들어온 사용자라면 튜토리얼 자동 시작
    // useEffect(() => {
    //     const seen = localStorage.getItem("hasSeenTutorial");
    //     if (!seen && !forceStart) {
    //         setIsRunning(true);
    //         updateStep("0");
    //     }
    // }, [forceStart]);

    const handleStart = () => updateStep("1.1");

    const handleSkip = () => {
        setIsRunning(false);
        localStorage.setItem("hasSeenTutorial", "true");
        setStep(null);
        onStepChange?.(null);
        hasForced.current = false;
    };

    // 업로드 완료 시 1.1 → 1.2 로 자동 전환
    useEffect(() => {
        if (step === "1.1" && isImageUploaded) {
            updateStep("1.2");
        }
    }, [step, isImageUploaded]);

    if (!isRunning) return null;

    return (
        <>
            {step === "0" && <TutorialStart onStart={handleStart} onSkip={handleSkip} />}

            {(step === "1.1" || step === "1.2") && (
                <TutorialStep1
                    phase={step}
                    onNext={() => updateStep("2")}
                    onPrev={() => updateStep("0")}
                    onSkip={handleSkip}
                />
            )}

            {step === "2" && (
                <TutorialStep2
                    onNext={() => {
                        handleSkip(); // 튜토리얼 종료
                    }}
                    onPrev={() => updateStep("1.1")}
                    onSkip={handleSkip}
                />
            )}
        </>
    );
}

export default TutorialManager;

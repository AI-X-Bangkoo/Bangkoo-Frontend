import React, { useEffect, useState, useRef} from "react";
import TutorialStart from "./TutorialStart";
import TutorialStep1 from "./TutorialStep1";

function TutorialManager({ isImageUploaded, forceStart, onStepChange }) {
    const [step, setStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const hasForced = useRef(false);

    const updateStep = (newStep) => {
        setStep(newStep);
        if (typeof onStepChange === "function") {
            onStepChange(newStep);
        }
    };

    useEffect(() => {
        if (forceStart && !hasForced.current) {
            hasForced.current = true;
            setIsRunning(true);
            updateStep(0);
        }
    }, [forceStart]);

    // 기존 자동 시작 로직도 유지
    useEffect(() => {
        const seen = localStorage.getItem("hasSeenTutorial");
        if (!seen && !forceStart) {
            setIsRunning(true);
            updateStep(0);
        }
    }, [forceStart]);

    const handleStart = () => updateStep(1);
    const handleSkip = () => {
        setIsRunning(false);
        localStorage.setItem("hasSeenTutorial", "true");
        setStep(null); // 내부 상태 초기화
        onStepChange?.(null);
        hasForced.current = false; // 다시 시작 가능하게
    };

    useEffect(() => {
        if (step === 1 && isImageUploaded) {
            updateStep(2);
        }
    }, [step, isImageUploaded]);

    if (!isRunning) return null;

    return (
        <>
            {step === 0 && <TutorialStart onStart={handleStart} onSkip={handleSkip} />}
            {step === 1 &&
                <TutorialStep1
                    onNext={() => setStep(2)}
                    onPrev={() => setStep(0)}
                    onSkip={handleSkip}
                />
            }
        </>
    );
}
export default TutorialManager;

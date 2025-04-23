import React, { useEffect, useState, useRef } from "react";
import TutorialStart from "./TutorialStart";
import TutorialStep1 from "./TutorialStep1";
import TutorialStep2 from "./TutorialStep2";
import TutorialStep6 from "./TutorialStep6";

function TutorialManager({ isImageUploaded, forceStart, onStepChange, externalStep }) {
    const [step, setStep] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const hasForced = useRef(false);

    const updateStep = (newStep) => {
        setStep(newStep);
        if (typeof onStepChange === "function") {
            onStepChange(newStep);
        }
    };

    // 현재 튜토리얼 단계 디버깅 로그
    useEffect(() => {
        if (step) console.log("🎯 튜토리얼 현재 단계:", step);
    }, [step]);

    // 외부에서 step이 바뀌면 내부도 반영
    useEffect(() => {
        if (externalStep && externalStep !== step) {
            setStep(externalStep);
        }
    }, [externalStep]);

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
            {/* 튜토리얼 시작 화면 */}
            {step === "0" && <TutorialStart onStart={handleStart} onSkip={handleSkip} />}

            {/* Step 1 */}
            {(step === "1.1" || step === "1.2") && (
                <TutorialStep1
                    phase={step}
                    onNext={() => updateStep("2.1")} // ✅ Step2로 이동
                    onPrev={() => updateStep("0")}
                    onSkip={handleSkip}
                />
            )}

            {/* Step 2 */}
            {["2.1", "2.2", "2.3"].includes(step) && (
                <TutorialStep2
                    phase={step}
                    onNext={() => {
                        if (step === "2.1") updateStep("2.2");
                        else if (step === "2.2") updateStep("2.3");
                        // else if (step === "2.3") handleSkip(); //  튜토리얼 종료
                        else if (step === "2.3") updateStep("6.1"); //  튜토리얼 종료
                    }}
                    onPrev={() => updateStep("1.2")}
                    onSkip={handleSkip}
                />
            )}

            {/* Step 6 */}
            {["6.1", "6.2", "6.3", "6.4"].includes(step) && (
                <TutorialStep6
                    phase={step}
                    onNext={() => {
                        if (step === "6.1") updateStep("6.2");
                        else if (step === "6.2") updateStep("6.3");
                        else if (step === "6.3") updateStep("6.4");
                        else if (step === "6.4") {
                            // 튜토리얼 종료
                            setIsRunning(false);
                            localStorage.setItem("hasSeenTutorial", "true");
                            updateStep(null);
                            hasForced.current = false;
                            onStepChange?.(null);
                        }
                    }}
                    onPrev={() => {
                        if (step === "6.4") updateStep("6.3");
                        else if (step === "6.3") updateStep("6.2");
                        else if (step === "6.2") updateStep("6.1");
                        else if (step === "6.1") updateStep("5.3"); // 👉 이전 스텝으로 돌아가게 설정
                    }}
                    onSkip={handleSkip}
                />
            )}
        </>
    );
}

export default TutorialManager;

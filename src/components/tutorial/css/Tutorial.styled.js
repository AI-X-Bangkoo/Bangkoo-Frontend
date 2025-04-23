import styled, { keyframes } from "styled-components";

const glow = keyframes`
  0% { opacity: 0.2; text-shadow: 0 0 2px #f90; }
  50% { opacity: 1; text-shadow: 0 0 8px #f90; }
  100% { opacity: 0.2; text-shadow: 0 0 2px #f90; }
`;

//TutorialStart
export const Backdrop = styled.div`
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  background: rgba(0,0,0,0.85);
  z-index: 9998;
`;

export const Backdrop6 = styled(Backdrop)`
  pointer-events: none;
`;

export const Modal = styled.div`
  width: 600px;
  position: fixed;
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 9999;
`;

export const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.5;
  margin-bottom: 24px;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 500;
   & span {
     color: ${({ theme }) => theme.colors.orange};
     //animation: ${glow} 1s ease-in-out infinite;
   }

  &.typing span {
    // animation: ${glow} 1s ease-in-out infinite;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  
  & button:last-child {
    margin-left: 16px;
  }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 153, 0, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 153, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 153, 0, 0); }
`;

// TutorialStep1
export const HighlightStyle = styled.div`
  position: absolute;
  width: 120px;
  z-index: 9999; /* 업로드 버튼보다 위로 */
  pointer-events: none;
  border: 2px solid ${({ theme }) => theme.colors.orange};;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-sizing: border-box;
  animation: ${pulse} 1.5s infinite;
  transition: width 0.2s, height 0.2s;
`;
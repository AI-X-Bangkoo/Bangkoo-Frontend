import styled from "styled-components";
import banner from "../../assets/images/BannerImage.png"

// 배너
export const BannerRoot = styled.div`
  width: 100%;
  height: 450px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.black};
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url(${banner});
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
    opacity: 0.7;
    z-index: 0;
  }
  & > button {
    position: relative;
    z-index: 10;
    box-shadow: 0 3px 4px rgba(0, 0, 0, 0.25);
  }
`;

export const BannerText = styled.p`
  position: relative;
  z-index: 10;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  line-height: 60px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-shadow: 0 3px 4px rgba(0, 0, 0, 0.25);
  & span {
    font-weight: 900;
  }
`;

// STEP
export const StepRoot = styled.div`
  width: 100%;
  height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 16px;
  box-sizing: border-box;
  background-color: ${({ theme, type }) =>
          type === "basic" ? theme.colors.white : theme.colors.lightOrange};
`;

export const StepRootIn = styled.div`
  width: ${({ theme }) => theme.display.sm};
  display: flex;
  align-items: center;
`;

export const StepBox = styled.div`
  width: 50%;
`;

export const ImageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  & img {
    display: block;
    transform: scale(0.9)
  }
`;

export const TextBox = styled.div`
  & p:first-child {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  & p:last-child {
    margin-top: ${({ theme }) => theme.spacing.md};
  }
`;

// 지금 시작하기 버
export const StartRoot = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1)
`;
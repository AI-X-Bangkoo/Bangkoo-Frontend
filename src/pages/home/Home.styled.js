import styled from "styled-components";
import banner from "../../assets/images/BannerImage.png"

export const HomeRoot = styled.div`
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

export const HomeTextStyle = styled.p`
  position: relative;
  z-index: 10;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  line-height: 68px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-shadow: 0 3px 4px rgba(0, 0, 0, 0.25);
  & span {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 900;
  }
`;

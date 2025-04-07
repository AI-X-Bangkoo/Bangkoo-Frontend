import styled from "styled-components";
import { media } from "../../common/css/media"
// import { styled as muiStyled } from "@mui/material/styles";
// import Switch from "@mui/material/Switch";

// 버튼
export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 6px;
  box-sizing: border-box;
  min-width: ${({ width }) => width || "auto"};
  height: ${({ height }) => height || "40px"};
  background-color: ${({ theme, bg, type }) =>
    type === "outline" ? "transparent" : theme.colors[bg] || bg || theme.colors.orange};
  color: ${({ theme, color, type, bg }) =>
    type === "outline"
        ? theme.colors[bg] || bg || theme.colors.orange
        : theme.colors[color] || color || "#fff"};
  font-size: ${({ theme, fontSize }) =>
    theme.fontSizes[fontSize] || fontSize || theme.fontSizes.base};
  font-weight: ${({ fontWeight }) => fontWeight || 500};
  border-radius: ${({ theme, radius }) => theme.borderRadius[radius] || radius || "6px"};
  border: ${({ theme, type, bg }) =>
    type === "outline" ? `1px solid ${theme.colors[bg] || bg || theme.colors.orange}` : "none"};
  cursor: pointer;
  transition: 0.2s;
  
  &:hover {
    background-color: ${({ theme, bg, type }) =>
            type === "none" ? "transparent" : theme.colors[bg] || bg || theme.colors.orange};
    color: ${({ theme, color, type, bg }) =>
            type === "none"
                    ? theme.colors[bg] || bg || theme.colors.orange
                    : theme.colors[color] || color || "#fff"};
  }
`;

// 아이콘 버튼
export const StyledIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  box-sizing: border-box;
  width: ${({ width }) => width || "34px"};
  height: ${({ height }) => height || "34px"};
  cursor: pointer;
  transition: 0.2s;
  border-width: ${({ type }) => type === "outline" ? '1px' : "none"};
  border-style: ${({ type }) => type === "outline" ? 'solid' : "none"};
  border-color: ${({ theme, color, type }) => type === "outline" ? color : "none"};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme, color, type }) =>
    type === "full" ? theme.colors[color] || color || theme.colors.orange : 'transparent'};
  box-shadow: ${({ type }) =>
    type === "full" ? "0 2px 4px rgba(0, 0, 0, 0.25)" : 'none'};

  ${media.tablet`
    width: 30px;
    height: 30px;
      
    & svg {
      width: 20px;
      height: 20px;
    }
  `}
`;


/* --- MUI Switch 커스텀 --- */
// 커스텀 Switch
// export const SwitchContainer = styled.div`
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   position: relative;
//   width: 100px;
//   height: 42px;
//   cursor: pointer;
//
//   ${media.tablet`
//     width: 80px;
//     height: 34px;
//   `}
// `;
//
// // "AI 검색" 텍스트
// export const Label = muiStyled("span")(({ theme, $checked }) => ({
//     fontSize: theme.fontSizes.xs,
//     fontWeight: 800,
//     color: $checked ? theme.colors.white : theme.colors.black,
//     position: "absolute",
//     zIndex: 2,
//     left: $checked ? 12 : "auto",
//     right: $checked ? "auto" : 12,
//     transition: "all 0.3s ease",
// }));
//
// // MUI Switch 커스텀
// export const CustomSwitch = muiStyled(Switch)(({ theme }) => ({
//     width: 100,
//     height: 42,
//     padding: 0,
//     "& .MuiSwitch-switchBase": {
//         padding: 0,
//         margin: 5,
//         transitionDuration: "300ms",
//         "&.Mui-checked": {
//             transform: "translateX(58px)",
//             color: "#fff",
//             "& + .MuiSwitch-track": {
//                 backgroundColor: theme.colors.orange,
//                 opacity: 1,
//             },
//         },
//     },
//     "& .MuiSwitch-switchBase > div": {
//         width: 32,
//         height: 32,
//         borderRadius: "50%",
//         backgroundColor: "#fff",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: theme.fontSizes.xxs,
//         fontWeight: 700,
//     },
//     "& .MuiSwitch-track": {
//         borderRadius: 40,
//         backgroundColor: theme.colors.grey,
//         opacity: 1,
//         transition: "background-color 0.3s",
//     },
// }));

// input

export const InputWrapper = styled.div`
  position: relative;
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "40px"};
  border: ${({ theme, $custom, $line }) =>
      $custom === "outline" ? `1px solid ${theme.colors[$line] || $line || theme.colors.grey}` : "none"};
  border-radius: ${({theme}) => theme.borderRadius.sm};
  background-color: #fff;
`;

export const InputStyle = styled.input`
  width: calc(100% - 20px - 6px);
  height: 100%;
  border: none;
  padding: 0 10px;
  box-sizing: border-box;
  background-color: transparent;
  font-size: ${({ theme, fontSize }) =>
          fontSize ? theme.fontSizes[fontSize] : theme.fontSizes.sm};

  &::placeholder {
    color: rgba(205,205,205.1);
    font-weight: 800;
  }
  &:focus {
    outline: none;
  }

  ${media.tablet`
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `}
  
  ${media.mobile`
    font-size: ${({ theme }) => theme.fontSizes.xs};
  `}
`;

export const ClearAllBox = styled.div`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 14px;
    height: 14px;
    path {
      stroke: ${({ theme }) => theme.colors.white};
    }
  }
`;

// 이미지 박스
export const ImageBoxStyle = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grey};
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover div.center-box {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const AiChip = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 0;
  color: #fff;
  font-size:  ${({ theme }) => theme.fontSizes.xxs};
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  box-sizing: border-box;
`;

export const CenterBox = styled.div.attrs(() => ({
    className: "center-box"
  }))`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
`;

export const BottomRightBox = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
`;

export const CheckboxArea = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  cursor: pointer;
`;

// tabs
export const TabMenu = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const TabLineStyle = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.darkGrey};
`;

export const Tab = styled.button`
  position: relative;
  padding: 6px 12px;
  font-size: ${({ theme, fontSize }) =>
      theme.fontSizes[fontSize] || fontSize || theme.fontSizes.base};
  font-weight: ${({ $active }) => ($active ? 800 : 500)};
  color: ${({ theme, $active }) =>
      $active ? theme.colors.orange : theme.colors.darkGrey};
  border: none;
  background: none;
  border-bottom: ${({ $active, theme }) =>
      $active ? `3px solid ${theme.colors.orange}` : "3px solid transparent"};
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
   
  }

  ${media.tablet`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    padding: 6px 10px;
  `}
  
`;


// 토스트 팝업

export const ToastContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  justify-content: space-between;
  
  & > div {
    display: flex;
    align-items: center;
    & p {
      margin-left: ${({ theme }) => theme.spacing.xs};
    }
  }
  
  & > button > svg {
    & path {
      stroke: ${({ theme }) => theme.colors.white};
    }
  }
`;
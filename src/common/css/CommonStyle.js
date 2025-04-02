import styled from "styled-components";

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 6px;
  box-sizing: border-box;
  width: ${({ width }) => width || "auto"};
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
`;

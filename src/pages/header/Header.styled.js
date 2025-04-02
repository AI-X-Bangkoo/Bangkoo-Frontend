import styled from "styled-components";

export const HeaderRoot = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.headerHeight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey};
  padding: 6px 34px;
  box-sizing: border-box;
  & svg {
    cursor: pointer;
  }
`;

import styled from "styled-components";

export const MyRoomRoot = styled.div`
  display: flex;
  margin-top: ${({ theme }) => theme.headerHeight};
  height: calc(100vh - ${({ theme }) => theme.headerHeight});
`;

export const LeftBox = styled.div`
  width: calc(100% - 600px);
  height: inherit;
`;

export const RightBox = styled.div`
  width: 600px;
  height: inherit;
  border-left: 1px solid ${({ theme }) => theme.colors.grey}
`;

import styled from "styled-components";
import { media } from "../../common/css/media"

// 배너
export const SearchRoot = styled.div`
  width: 700px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  
  & input {
    // 100% - 메뉴 - marginRight - switch - 음성 - 검색
    width: calc(100% - 30px - 6px - 110px - 30px - 30px);
  }
  
  & button:first-child {
    margin-right: 6px;
  }
`;

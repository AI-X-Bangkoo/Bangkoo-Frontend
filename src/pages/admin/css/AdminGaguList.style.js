import styled from "styled-components";

export const GaguListContainer = styled.div`
  padding: 20px;
`;

//가구 목록 헤드부분 작업
export const GaguListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 100%;
`;

export const GaguListHeaderItem = styled.div`
  margin: 0 5%; // 각 항목들 사이에 여백을 추가
  &:nth-child(1) {
    margin: 2%;
  }
  &:nth-child(2) {
    margin: 1%;
  }
  &:nth-child(3) {
    margin: 0 5%;
  }
  &:last-child {
    margin-right: 0; // 마지막 항목에는 여백을 주지 않음
  }
`;

export const GaguListHeaderSpacer = styled.div`
  flex-grow: 1; // 마지막 항목 뒤로 공간을 차지하여 여백을 만들어줌
`;

export const GaguItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 4px;

  div {
    flex: 1;
    text-align: center;
  }

  div:first-child {
    text-align: left;
  }
`;

export const PaginationContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

export const PaginationButton = styled.button`
  padding: 6px 10px;
  margin: 0 4px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #bbb;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #1976d2;
  }
`;

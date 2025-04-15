import styled from "styled-components";

// 리스트 전체 컨테이너: 전체 높이 고정 + 내부 레이아웃 정렬
export const GaguListContainer = styled.div`
  height: 80vh;  // 전체 화면 높이에서 헤더, 여백 제외
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
`;

// 테이블 영역을 꽉 채우게
export const GaguTableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

// 테이블 스타일
export const GaguTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
`;

// 테이블 헤드
export const GaguListHeader = styled.thead`
  background-color: #f4f4f4;
`;

export const GaguListHeaderRow = styled.tr``;

export const GaguListHeaderItem = styled.th`
  padding: 8px;
  text-align: center;
  font-weight: bold;
  border-bottom: 2px solid #ddd;

  &:nth-child(1) { width: 5%; }
  &:nth-child(2) { width: 10%; }
  &:nth-child(3) { width: 15%; }
  &:nth-child(4) { width: 20%; }
  &:nth-child(5) { width: 20%; }
  &:nth-child(6) { width: 10%; }
  &:nth-child(7) { width: 10%; }
  &:nth-child(8) { width: 10%; }
`;

// 테이블 바디
export const GaguListBody = styled.tbody`
  display: table-row-group;
`;

// 리스트 아이템 (행)
export const GaguItem = styled.tr`
  background-color: #fff;
  border-bottom: 1px solid #eee;
  height: 15px;  // 행 높이 줄임

  &:hover {
    background-color: #f0f0f0;
  }
`;

// 셀 스타일 (td)
export const GaguListItem = styled.td`
  padding:0.7px 4px;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  img {
    height: 20px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }
`;

// 페이지네이션 컨테이너 (항상 아래에 있도록)
export const PaginationContainer = styled.div`
  padding: 10px 0;
  text-align: center;
  background-color: #f9f9f9;
  flex-shrink: 0;
`;

// 페이지네이션 버튼
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

  &:focus {
    outline: none;
  }
`;

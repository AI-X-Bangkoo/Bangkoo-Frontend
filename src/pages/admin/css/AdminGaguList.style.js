import styled from "styled-components";

export const GaguListContainer = styled.div`
  padding: 20px;
  overflow-x: auto; // 작은 화면에서 테이블이 넘어가지 않도록 처리
`;

// 테이블 스타일
export const GaguTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  box-sizing: border-box;
  table-layout: fixed;  // 고정 레이아웃으로 열 너비를 일정하게 설정
`;

// 테이블 헤드
export const GaguListHeader = styled.thead`
  background-color: #f4f4f4;
`;

export const GaguListHeaderRow = styled.tr``;

export const GaguListHeaderItem = styled.th`
  padding: 12px 10px;
  text-align: center;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  box-sizing: border-box;  // padding을 포함하여 크기 계산
  &:nth-child(1) { width: 5%; text-align: left; padding-left: 4px; }  // 체크박스
  &:nth-child(2) { width: 10%; text-align: center; padding-left: 10px; } // 번호
  &:nth-child(3) { width: 20%; text-align: center; padding-left: 10px; } // 이미지
  &:nth-child(4) { width: 25%; text-align: center; padding-left: 10px; } // 가구명
  &:nth-child(5) { width: 30%; } // Description
  &:nth-child(6) { width: 10%; } // 등록일
  &:nth-child(7) { width: 10%; } // 수정일
  &:nth-child(8) { width: 10%; } // 수정 버튼
`;

// 테이블 바디
export const GaguListBody = styled.tbody``;

// 리스트 아이템 (행)
export const GaguItem = styled.tr`
  background-color: #fff;
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: #f9f9f9;
  }
`;

// 테이블 데이터 셀
export const GaguListItem = styled.td`
  padding: 10px;
  text-align: center;
  box-sizing: border-box;  // padding을 포함하여 크기 계산

  &:nth-child(1) { padding-left: 4px; } // 체크박스
  &:nth-child(2) { padding-left: 8px; } // 번호
  &:nth-child(3) { text-align: center; padding-left: 10px; } // 이미지
  &:nth-child(4) { text-align: center; padding-left: 10px; } // 가구명
  &:nth-child(5) { padding-left: 10px; } // Description
  &:nth-child(6) { padding-left: 10px; } // 등록일
  &:nth-child(7) { padding-left: 10px; } // 수정일
  &:nth-child(8) { padding-left: 10px; } // 수정 버튼
`;

// 페이지네이션 컨테이너
export const PaginationContainer = styled.div`
  margin-top: 20px;
  text-align: center;
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
`;

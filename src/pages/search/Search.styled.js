import styled from "styled-components";
import { media } from "../../common/css/media"

// 검색박스
export const SearchRoot = styled.div`
  width: 700px;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  box-shadow: ${({ $shadow }) => $shadow ? '0 4px 4px rgba(0,0,0,0.25)': 'none'};
  border: ${({ theme, $border }) => $border === 'orange' ? `3px solid ${theme.colors.orange}`: `1px solid ${theme.colors.grey}`};
  
  & input {
    // 100% - 메뉴 - 음성 - 검색
    width: calc(100% - 34px - 34px - 34px);
  }

  ${media.tablet`
    width: 100%;
    
    & input {
      width: calc(100% - 30px - 30px - 30px);
    }
  
    & > div > span:first-child {
      font-size: 12px;
    }
    
    & > div > span:last-child {
      width: 80px;
      height: 34px;
      
      & .MuiSwitch-switchBase.Mui-checked {
        transform: translateX(46px)
      }
      
      & .MuiSwitch-switchBase > div {
        width: 24px;
        height: 24px;
        font-size: 10px;
      }
    }
    
  `}
`;

export const SearchBox = styled.div`
  position: absolute !important;
  top: 80px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 3px solid ${({ theme }) => theme.colors.orange};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 20px 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 4px rgba(0,0,0,0.25);

  ${media.tablet`
    top: 70px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: 20px 10px;
  `}
` ;

// AI검색 설명
export const ExplanationBox = styled(SearchBox)`
  & p {
    text-align: center;
  }

  & p:nth-child(2) {
    line-height: 1.6;
    margin-top: 12px;
    margin-bottom: 16px;
  }

  ${media.tablet`
    & p:nth-child(2) {
      font-size: 14px;
      margin-top: 6px;
      margin-bottom: 6px;
    }
  
  `}
`;

export const ImageBox = styled.div`
  width: 85%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  & img {
    width: 100%;
  }

  ${media.tablet`
    width: 95%;
  `}
`;

export const TypingText = styled.p`
  position: absolute;
  top: -4px;
  left: 110px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  white-space: pre-wrap;
  text-align: left;
  align-self: flex-start; // 부모가 flex일 경우 왼쪽 정렬
  width: auto;
  max-width: 100%;

  ${media.tablet`
    font-size: ${({ theme }) => theme.fontSizes.xxs};
    top: -3px;
    left: 80px;
  `}
`;

// 최근 검색어
export const SearchTermBox = styled(SearchBox)`
  width: 100%;
  padding: 30px 30px;
  flex-direction: row;
  align-items: flex-start;
`;

export const RecentBox = styled.div`
  width: 65%;
  padding: 0 20px 0 0;
  box-sizing: border-box;
  border-right: 1px solid ${({ theme }) => theme.colors.grey};
`;

export const RecentTitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  & p:last-child {
    cursor: pointer;
  }
`;

export const SearchScrollBox = styled.div`
  width: 100%;
  height: 190px;
  overflow-y: auto;
  padding-right: 3px;
  /* 스크롤바 전체 영역 */
  &::-webkit-scrollbar {
    width: 10px;
  }

  /* 스크롤바 트랙 (배경) */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 스크롤바 핸들 (움직이는 부분) */
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.darkGrey};
    border-radius: 10px;
    background-clip: padding-box;
    border: 3px solid transparent;
  }
`;

export const KeywordBox = styled(SearchScrollBox)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 235px;
  
  & button {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const RecentTextBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  & svg {
    width: 12px;
    height: 12px;
    & path {
      stroke: ${({ theme }) => theme.colors.white};
    }
  }
`;

export const RecentBottomBox = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.grey};
  padding: 6px;
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: flex-end;
  & p {
    cursor: pointer;
  }
`;

export const PopularityBox = styled.div`
  width:35%;
  padding: 0 0 0 20px;
  box-sizing: border-box;

  & p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;


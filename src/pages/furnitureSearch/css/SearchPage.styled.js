import styled from "styled-components";
import { media } from "@/common/css/media"

export const SearchRoot = styled.div`
  width: ${({ theme }) => theme.display.base};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 56px;
  box-sizing: border-box;
  margin: ${({ theme }) => theme.headerHeight} auto;
  
  
  & > div > div > div {
    box-shadow: none;
  }
  
  ${media.tablet`
  
  `}
` ;

export const GridBox = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 40px 24px;
  margin-top: 32px;

  & > div > p:nth-child(2){
    margin-top: ${({ theme }) => theme.spacing.md};
  }
  
  & > div > p:nth-child(3){
    margin-top: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  & > div > button {
    margin-top: ${({ theme }) => theme.spacing.md};
  }
` ;

export const SearchTermBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  
  & > p {
    margin: 40px 0 24px;
  }
` ;
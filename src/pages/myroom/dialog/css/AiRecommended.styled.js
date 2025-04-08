import styled from "styled-components";

export const AiRecommendedRoot = styled.div`
  display: flex;
  flex-direction: column;
  
  & > p {
    margin-bottom: ${({ theme }) => theme.spacing.sm};;
  }
`;

export const BudgetInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const BudgetInputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const BudgetInput = styled.input`
  border: none;
  outline: none;
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  color: ${({ theme }) => theme.colors.black};
  font-weight: 500;
  width: 100px;
  appearance: none;
  text-align: right;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  &[type='number'] {
    appearance: textfield;
  }
`;

export const StyleButtonWrapper = styled.div`
  width: 385px;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyleButton = styled.button`
  min-width: 90px;
  padding: 6px 10px;
  border-radius: 20px;
  border: 1px solid ${({ $active }) => ($active ? "#f4a100" : "#ccc")};
  background-color: ${({ $active }) => ($active ? "#f4a100" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  cursor: pointer;
  font-size: 13px;
`;
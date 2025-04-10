import styled from "styled-components";

export const DeleteBox = styled.div`
  display: flex;
  justify-content: flex-end;
  & > button {
    margin-bottom: ${({ theme }) => theme.spacing.sm };
  }
`;

export const UploadContainer = styled.div`
  height: 100%;
  max-height: calc(100vh - ${({ theme }) => theme.headerHeight } - 199px);
  border: ${({ theme, $hasImage }) => $hasImage ? `1px solid ${theme.colors.grey}` : `2px dashed ${theme.colors.grey}`};
  border-radius: ${({ theme }) => theme.borderRadius.md };
  text-align: center;
  background-color: ${({ theme }) => theme.colors.white };
  //cursor: pointer;
  position: relative;
  box-sizing: border-box;
`;

export const UploadBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  & p {
    margin: ${({ theme }) => theme.spacing.xl} 0 0;
  }
`;

export const UploadInput = styled.input`
  display: none;
`;

export const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
`;

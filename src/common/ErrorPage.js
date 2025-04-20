import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Error500 } from '../assets/images/Error500.svg';
import { ReactComponent as Error404 } from '../assets/images/Error404.svg';
import { Link } from 'react-router-dom';

const Root = styled.div`
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  padding-top: ${({ theme }) => theme.headerHeight};
  background: ${({ theme }) => theme.colors.lightOrange};
`;

const RootIn = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > svg {
    width: 400px;
    height: auto;
  }
  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const TextStyle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
`;

const SmallStyle = styled.p`
  margin: 6px 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.grey};
  & a {
    color: ${({ theme }) => theme.colors.orange};
    font-weight: bold;
    text-decoration: none;
  }
`;

const ErrorPage = ({error = "404"}) => {
    return (
        <Root>
            <RootIn>
                {error === "500" &&
                    <div>
                        <Error500/>
                        <TextStyle>Sorry! Something went wrong on our end.</TextStyle>
                        <SmallStyle>
                            Please try again in a moment.
                        </SmallStyle>
                        <SmallStyle>
                            <Link to="/">go back</Link>
                        </SmallStyle>
                    </div>
                }

                {error === "404" &&
                    <div>
                        <Error404/>
                        <TextStyle>Sorry, the page you're looking for doesn't exist.</TextStyle>
                        <SmallStyle>
                            Please check the URL or go back to the homepage.
                        </SmallStyle>
                        <SmallStyle>
                            <Link to="/">go back</Link>
                        </SmallStyle>
                    </div>
                }
            </RootIn>
        </Root>
    );
};

export default ErrorPage;
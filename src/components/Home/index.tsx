import React from "react";
import styled from "styled-components";
import Header from "../Header";
import LeftSideList from "../LeftSideList";
import BoardList from "../BoardList";

const Home: React.FC = () => {
  return (
    <StyledRoot>
      <Header />
      <LeftSideList />
      <BoardList />
    </StyledRoot>
  );
};

const StyledRoot = styled.div`
  display: flex;
`;

export default Home;

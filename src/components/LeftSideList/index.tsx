import React from "react";
import styled from "styled-components";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

type Props = {
  toggleLeftSideBar: (event: React.KeyboardEvent | React.MouseEvent) => void;
};

const LeftSideBar: React.FC<Props> = props => {
  const { toggleLeftSideBar } = props;

  return (
    <div
      role="presentation"
      onClick={toggleLeftSideBar}
      onKeyDown={toggleLeftSideBar}
    >
      <StyledLeftSideBar>
        <Toolbar>
          <Typography variant="h4">Skeban</Typography>
        </Toolbar>
        <Divider />
      </StyledLeftSideBar>
    </div>
  );
};

const StyledLeftSideBar = styled(Container)`
  width: 30%;
`;

export default LeftSideBar;

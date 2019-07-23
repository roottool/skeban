import React from "react";
import styled from "styled-components";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import State from "../../State";

type Props = {
  toggleLeftSideBar: (event: React.KeyboardEvent | React.MouseEvent) => void;
};

const LeftSideBar: React.FC<Props> = props => {
  const { toggleLeftSideBar } = props;

  const StateContainer = State.useContainer();

  const handleAddButtonClicked = () => {
    StateContainer.onBoardAdded();
  };

  return (
    <div
      role="presentation"
      onClick={toggleLeftSideBar}
      onKeyDown={toggleLeftSideBar}
    >
      <Container>
        <Toolbar>
          <Typography variant="h4">Skeban</Typography>
        </Toolbar>
        <Divider />
        <StyledAddbuttonArea>
          <Fab
            color="primary"
            aria-label="Add"
            onClick={handleAddButtonClicked}
          >
            <AddIcon />
          </Fab>
        </StyledAddbuttonArea>
      </Container>
    </div>
  );
};

const StyledPaper = styled(Paper)`
  min-height: 120px;
  margin-top: 16px;
`;

const StyledAddbuttonArea = styled.div`
  text-align: center;
  margin-top: 16px;
`;

export default LeftSideBar;

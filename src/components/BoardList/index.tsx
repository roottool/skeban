import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import State from "../../State";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      flexGrow: 1
    },
    toolbar: theme.mixins.toolbar
  })
);

const BoardList: React.FC = () => {
  const StateContainer = State.useContainer();
  const classes = useStyles();

  const handleAddButtonClicked = () => {
    StateContainer.onBoardAdded();
  };

  const renderBoards = () => {
    const result = StateContainer.allBoards.map(board => {
      if (!board.id) {
        return <></>;
      }

      const title = board.title ? board.title : "The title is empty";
      return (
        <StyledLink to={`/board/${board.id}`} key={board.id}>
          <StyledPaper>
            <Typography variant="h6">{title}</Typography>
          </StyledPaper>
        </StyledLink>
      );
    });
    return result;
  };

  return (
    <main className={classes.main}>
      <div className={classes.toolbar} />
      <Container>
        {renderBoards()}
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
    </main>
  );
};

const StyledLink = styled(Link)`
  text-decoration-line: none;
`;

const StyledPaper = styled(Paper)`
  min-height: 120px;
  margin-top: 16px;
`;

const StyledAddbuttonArea = styled.div`
  text-align: center;
  margin-top: 16px;
`;

export default BoardList;

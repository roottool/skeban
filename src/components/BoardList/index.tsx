import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import State from "../../State";
import { leftSideListAreaWidth } from "../../GlobalStyles";

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
          <StyledCard>
            <CardContent>
              <StyledBoardTitleTypography variant="h4">
                {title}
              </StyledBoardTitleTypography>
            </CardContent>
          </StyledCard>
        </StyledLink>
      );
    });
    return result;
  };

  return (
    <main className={classes.main}>
      <StyledPaper>
        <div className={classes.toolbar} />
        {renderBoards()}
        <StyledAddbuttonArea>
          <Fab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="Add new board"
            onClick={handleAddButtonClicked}
          >
            <AddIcon />
            ADD NEW BOARD
          </Fab>
        </StyledAddbuttonArea>
      </StyledPaper>
    </main>
  );
};

const StyledLink = styled(Link)`
  text-decoration-line: none;
`;

const StyledPaper = styled(Paper)`
  top: 0;
  width: calc(100% - ${leftSideListAreaWidth}px);
  height: 100%;
  outline: 0;
  position: fixed;
  overflow: auto;
`;

const StyledCard = styled(Card)`
  min-height: 120px;
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
`;

const StyledBoardTitleTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledAddbuttonArea = styled.div`
  text-align: center;
  margin-top: 16px;
`;

export default BoardList;

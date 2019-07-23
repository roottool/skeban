import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Delete from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import State from "../../State";
import LeftSideBar from "../LeftSideList";

type ElevationScrollProps = {
  children: React.ReactElement;
};

type Props = {
  boardId: number;
};

const BoardHeader: React.FC<Props> = props => {
  const { boardId } = props;

  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);

  const Container = State.useContainer();

  const toggleLeftSideBar = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setIsLeftSideBarOpen(!isLeftSideBarOpen);
  };

  const ElevationScroll = (elevationScrollProps: ElevationScrollProps) => {
    const { children } = elevationScrollProps;
    return React.cloneElement(children, {
      elevation: 4
    });
  };

  const handleDeleteButtonClicked = () => {
    Container.onBoardDeleted(boardId);
  };

  const renderBoardTitle = () => {
    const board = Container.allBoards.find(
      boardData => boardData.id === boardId
    );

    if (board) {
      const title = board.title ? board.title : "The title is empty";
      return <Typography variant="h6">{title}</Typography>;
    }

    return <></>;
  };

  return (
    <Fragment>
      <ElevationScroll {...Fragment}>
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Menu"
              onClick={toggleLeftSideBar}
              onKeyDown={toggleLeftSideBar}
            >
              <MenuIcon />
            </IconButton>
            {renderBoardTitle()}
            <StyledFlexGrow />
            <StyledLink to="/">
              <IconButton
                aria-label="Delete the board"
                onClick={handleDeleteButtonClicked}
                color="inherit"
              >
                <Delete />
              </IconButton>
            </StyledLink>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Drawer open={isLeftSideBarOpen} onClose={toggleLeftSideBar}>
        <LeftSideBar toggleLeftSideBar={toggleLeftSideBar} />
      </Drawer>
      <Toolbar />
    </Fragment>
  );
};

const StyledFlexGrow = styled.div`
  flex-grow: 1;
`;

const StyledLink = styled(Link)`
  color: inherit;
`;

export default BoardHeader;

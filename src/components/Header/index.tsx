import React, { useState } from "react";
import styled from "styled-components";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import LeftSideBar from "../LeftSideList";

type ElevationScrollProps = {
  children: React.ReactElement;
};

const Header: React.FC = () => {
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);

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

  return (
    <div>
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
          <StyledFlexGrow />
        </Toolbar>
      </AppBar>
      <Drawer open={isLeftSideBarOpen} onClose={toggleLeftSideBar}>
        <LeftSideBar toggleLeftSideBar={toggleLeftSideBar} />
      </Drawer>
      <Toolbar />
    </div>
  );
};

const StyledFlexGrow = styled.div`
  flex-grow: 1;
`;

export default Header;

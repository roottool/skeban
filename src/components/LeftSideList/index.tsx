import React from 'react'
import { Link } from 'react-router-dom'
import { remote } from 'electron'
import styled from 'styled-components'
import { grey } from '@material-ui/core/colors'
import Container from '@material-ui/core/Container'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import { leftSideListAreaWidth } from '../../GlobalStyles'

const useStyles = makeStyles((theme: Theme) => {
  const { shouldUseDarkColors } = remote.nativeTheme
  return createStyles({
    drawer: {
      width: leftSideListAreaWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: leftSideListAreaWidth,
      backgroundColor: shouldUseDarkColors ? grey[800] : '#fff'
    },
    toolbar: theme.mixins.toolbar
  })
})

const LeftSideList: React.FC = () => {
  const classes = useStyles()

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.toolbar} />
      <Container>
        <List>
          <StyledLink to="/" key="Home" replace>
            <ListItem button>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
          </StyledLink>
        </List>
      </Container>
    </Drawer>
  )
}

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration-line: none;
`

export default LeftSideList

import React from 'react'
import styled from 'styled-components'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: '#009CFF',
      color: 'white',
      zIndex: theme.zIndex.drawer + 1
    }
  })
)

const Header: React.FC = () => {
  const classes = useStyles()

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <StyledFlexGrow />
        </Toolbar>
      </AppBar>
    </>
  )
}

const StyledFlexGrow = styled.div`
  flex-grow: 1;
`

export default Header

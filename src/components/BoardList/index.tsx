import React from 'react'
import { Link } from 'react-router-dom'
import { remote } from 'electron'
import moment from 'moment'
import styled from 'styled-components'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { grey } from '@material-ui/core/colors'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import State from '../../State'
import { leftSideListAreaWidth } from '../../GlobalStyles'

const useStyles = makeStyles((theme: Theme) => {
  const { shouldUseDarkColors } = remote.nativeTheme
  return createStyles({
    main: {
      flexGrow: 1
    },
    card: {
      backgroundColor: shouldUseDarkColors ? grey[800] : '#fff'
    },
    paper: {
      backgroundColor: shouldUseDarkColors ? grey[900] : '#fff'
    },
    toolbar: theme.mixins.toolbar
  })
})

const BoardList: React.FC = () => {
  const StateContainer = State.useContainer()
  const classes = useStyles()

  const handleAddButtonClicked = () => {
    StateContainer.onBoardAdded()
  }

  const renderBoards = () => {
    const result = StateContainer.allBoards.map(board => {
      if (!board.id) {
        return <></>
      }

      const title = board.title || 'The title is empty'
      const showUpdatedAt = moment(board.updatedTimestamp).fromNow()
      return (
        <StyledLink to={`/board/${board.id}`} key={board.id}>
          <StyledCard className={classes.card}>
            <CardContent>
              <StyledBoardTitleTypography variant="h4">{title}</StyledBoardTitleTypography>
              <StyledBoardTitleTypography variant="subtitle1">
                {showUpdatedAt}
              </StyledBoardTitleTypography>
            </CardContent>
          </StyledCard>
        </StyledLink>
      )
    })
    return result
  }

  return (
    <main className={classes.main}>
      <StyledPaper className={classes.paper}>
        <div className={classes.toolbar} />
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
        {renderBoards()}
      </StyledPaper>
    </main>
  )
}

const StyledLink = styled(Link)`
  text-decoration-line: none;
`

const StyledPaper = styled(Paper)`
  position: fixed;
  top: 0;
  width: calc(100% - ${leftSideListAreaWidth}px);
  height: 100%;
  overflow: auto;
  outline: 0;
`

const StyledCard = styled(Card)`
  min-height: 120px;
  margin-top: 16px;
  margin-right: 16px;
  margin-left: 16px;
`

const StyledBoardTitleTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StyledAddbuttonArea = styled.div`
  margin-top: 16px;
  text-align: center;
`

export default BoardList

import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Fab from '@material-ui/core/Fab'
import Delete from '@material-ui/icons/Delete'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import State from '../../State'

type Props = {
  boardId: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: '#009CFF',
      color: 'white',
      zIndex: theme.zIndex.drawer + 1
    }
  })
)

const BoardHeader: React.FC<Props> = props => {
  const { boardId } = props
  const classes = useStyles()

  const Container = State.useContainer()

  const [isInputArea, setIsInputArea] = useState(false)

  const board = Container.allBoards.find(boardData => boardData.id === boardId)
  const boardTitle = board?.title || ''
  const [title, setTitle] = useState(boardTitle)

  const handleIsInputAreaChange = () => {
    Container.onBoardTitleChanged(boardId, title)
    setIsInputArea(!isInputArea)
  }

  const handleBoardTitleChanged = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
  ) => {
    setTitle(event.target.value)
  }

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleIsInputAreaChange()
    }
  }

  const handleDeleteButtonClicked = () => {
    Container.onBoardDeleted(boardId)
  }

  const renderBoardTitle = () => {
    if (!board) {
      return <></>
    }

    return (
      <>
        {isInputArea ? (
          <StyledBoardTitleForm>
            <StyledBoardTitleTextField
              id="board-name"
              label="Board Title"
              value={title}
              margin="normal"
              autoFocus
              fullWidth
              onChange={handleBoardTitleChanged}
              onKeyPress={handleKeyPressed}
              onBlur={handleIsInputAreaChange}
            />
          </StyledBoardTitleForm>
        ) : (
          <StyledBoardTitleDiv onClick={handleIsInputAreaChange}>
            <StyledBoardTitleTypography variant="h4">
              {board.title ? board.title : 'The title is empty'}
            </StyledBoardTitleTypography>
          </StyledBoardTitleDiv>
        )}
      </>
    )
  }

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar>
          {renderBoardTitle()}
          <StyledFlexGrow />
          <StyledLink to="/">
            <Fab
              variant="extended"
              size="medium"
              color="secondary"
              aria-label="Delete this board"
              onClick={handleDeleteButtonClicked}
            >
              <Delete />
              DELETE THIS BOARD
            </Fab>
          </StyledLink>
        </Toolbar>
      </AppBar>
    </>
  )
}

const StyledBoardTitleForm = styled.form`
  flex: 0 1 auto;
  width: 75vw;
`

const StyledBoardTitleTextField = styled(TextField)`
  background-color: white;
`

const StyledBoardTitleDiv = styled.div`
  max-width: 75vw;
  cursor: pointer;
`

const StyledBoardTitleTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StyledFlexGrow = styled.div`
  flex-grow: 1;
`

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration-line: none;
`

export default BoardHeader

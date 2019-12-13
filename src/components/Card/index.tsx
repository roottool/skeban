import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import MonacoEditor from 'react-monaco-editor'
import unified from 'unified'
import parse2Markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import highlight from 'rehype-highlight'
import rehype2react from 'rehype-react'
import MaterialCard from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Fab from '@material-ui/core/Fab'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import DeleteIcon from '@material-ui/icons/Delete'
import State from '../../State'
import 'highlight.js/styles/default.css'

interface Props {
  boardId: number
  cardId: number
  cardIndex: number
  onClicked: React.Dispatch<React.SetStateAction<boolean>>
}

const processor = unified()
  .use(parse2Markdown)
  .use(remark2rehype)
  .use(highlight)
  .use(rehype2react, { createElement: React.createElement })

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex.drawer + 1
    },
    toolbar: theme.mixins.toolbar
  })
)

const Card: React.FC<Props> = props => {
  const { boardId, cardId, cardIndex } = props
  const classes = useStyles()

  const Container = State.useContainer()
  const [isInputArea, setIsInputArea] = useState(false)

  const card = Container.allCards.find(cardData => cardData.id === cardId)
  const cardText = card?.text || ''
  const [text, setValue] = useState(cardText)

  useEffect(() => {
    const { onClicked } = props
    onClicked(isInputArea)
  }, [isInputArea])

  const handleIsInputAreaChange = () => {
    if (isInputArea) {
      Container.onCardTextChanged(boardId, cardId, text)
    }
    setIsInputArea(!isInputArea)
  }

  const handleValueChanged = (value: string) => {
    setValue(value)
  }

  const handleDeleteButtonClicked = () => {
    Container.onCardDeleted(boardId, cardId)
  }

  return (
    <>
      {isInputArea ? (
        <>
          <StyledRoot className={classes.root}>
            <StyledFakeHeader className={classes.toolbar} />
            <MonacoEditor
              height="80%"
              value={text}
              language="markdown"
              options={{
                automaticLayout: true
              }}
              onChange={value => handleValueChanged(value)}
              editorDidMount={editor => {
                editor.focus()
              }}
            />
            <StyledButtonArea>
              <Fab
                variant="extended"
                size="medium"
                color="primary"
                aria-label="DONE"
                onClick={handleIsInputAreaChange}
              >
                <CheckIcon />
                DONE
              </Fab>
              <Fab
                variant="extended"
                size="medium"
                color="secondary"
                aria-label="Delete this card"
                onClick={handleDeleteButtonClicked}
              >
                <DeleteIcon />
                DELETE THIS CARD
              </Fab>
            </StyledButtonArea>
          </StyledRoot>
        </>
      ) : (
        <Draggable draggableId={`cardId-${cardId}`} index={cardIndex}>
          {provided => (
            <StyledCard
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <CardContent>
                <StyledCardContentDiv onClick={handleIsInputAreaChange}>
                  {processor.processSync(text).contents}
                </StyledCardContentDiv>
              </CardContent>
            </StyledCard>
          )}
        </Draggable>
      )}
    </>
  )
}

const StyledRoot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const StyledFakeHeader = styled.div`
  margin-bottom: 16px;
`

const StyledCard = styled(MaterialCard)`
  padding: 0px;
  margin: 8px 16px;
`

const StyledButtonArea = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  margin-bottom: 16px;
`

const StyledCardContentDiv = styled.div`
  width: 100%;
  min-height: 72px;
  white-space: pre-line;
`

export default Card

import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import ReactMde from "react-mde";
import Showdown from "showdown";
import unified from "unified";
import parseMarkdown from "remark-parse";
import remark2html from "remark-stringify";
import highlight from "rehype-highlight";
import rehype2react from "rehype-react";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import { Draggable } from "react-beautiful-dnd";
import State from "../../State";
import "react-mde/lib/styles/css/react-mde-editor.css";
import "react-mde/lib/styles/css/react-mde-toolbar.css";
import "react-mde/lib/styles/css/react-mde.css";
import "react-mde/lib/styles/css/variables.css";

interface Props {
  boardId: number;
  cardId: number;
  cardIndex: number;
}

type SelectedTab = "write" | "preview" | undefined;

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

const processor = unified()
  .use(parseMarkdown)
  .use(remark2html)
  .use(highlight)
  .use(rehype2react);

const Card: React.FC<Props> = props => {
  const { boardId, cardId, cardIndex } = props;

  const Container = State.useContainer();
  const [isInputArea, setIsInputArea] = useState(false);
  const [selectedTab, setSelectedTab] = useState<SelectedTab>("write");

  const card = Container.allCards
    .filter(cardData => cardData.id === cardId)
    .pop();
  const cardText = card ? card.text : "";
  const [text, setValue] = useState(cardText);

  const handleisInputAreaChange = () => {
    if (isInputArea) {
      Container.onCardTextChanged(boardId, cardId, text);
    }
    setIsInputArea(!isInputArea);
  };

  const handleValueChanged = (value: string) => {
    setValue(value);
  };

  const handleDeleteButtonClicked = () => {
    Container.onCardDeleted(boardId, cardId);
  };

  return (
    <>
      {isInputArea ? (
        <div>
          <StyledPaper>
            <StyledReactMde
              value={text}
              onChange={handleValueChanged}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={markdown =>
                Promise.resolve(converter.makeHtml(markdown))
              }
            />
          </StyledPaper>
          <StyledButtonArea>
            <Fab
              color="secondary"
              aria-label="OK"
              onClick={handleisInputAreaChange}
            >
              <CheckIcon />
            </Fab>
            <Fab
              color="secondary"
              aria-label="Delete"
              onClick={handleDeleteButtonClicked}
            >
              <DeleteIcon />
            </Fab>
          </StyledButtonArea>
        </div>
      ) : (
        <Draggable draggableId={`${cardId}`} index={cardIndex}>
          {provided => (
            <StyledPaper
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <StyledCardContentDiv onClick={handleisInputAreaChange}>
                {processor.processSync(text).contents}
              </StyledCardContentDiv>
            </StyledPaper>
          )}
        </Draggable>
      )}
    </>
  );
};

const StyledPaper = styled(Paper)`
  padding: 0px;
  margin: 8px;
  cursor: pointer;
`;

const StyledReactMde = styled(ReactMde)`
  min-height: 72px;
`;

const StyledButtonArea = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 8px 0px;
`;

const StyledCardContentDiv = styled.div`
  width: 100%;
  min-height: 72px;
  white-space: pre-line;
`;

export default Card;

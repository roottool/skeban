import React, { useState } from "react";
import MaterialCard from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import styled from "styled-components";
import ReactMde from "react-mde";
import Showdown from "showdown";
import Markdown from "markdown-to-jsx";
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

const Card: React.FC<Props> = props => {
  const { boardId, cardId, cardIndex } = props;

  const Container = State.useContainer();
  const [isInputArea, setIsInputArea] = useState(false);
  const [selectedTab, setSelectedTab] = useState<SelectedTab>("write");

  const card = Container.allCards.find(cardData => cardData.id === cardId);
  const cardText = card?.text || "";
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
        <>
          <StyledMaterialCard>
            <StyledReactMde
              value={text}
              onChange={handleValueChanged}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={markdown => {
                return Promise.resolve(converter.makeHtml(markdown));
              }}
            />
          </StyledMaterialCard>
          <StyledButtonArea>
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="DONE"
              onClick={handleisInputAreaChange}
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
        </>
      ) : (
        <Draggable draggableId={`cardId-${cardId}`} index={cardIndex}>
          {provided => (
            <StyledMaterialCard
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <CardContent>
                <StyledCardContentDiv onClick={handleisInputAreaChange}>
                  <Markdown>{text}</Markdown>
                </StyledCardContentDiv>
              </CardContent>
            </StyledMaterialCard>
          )}
        </Draggable>
      )}
    </>
  );
};

const StyledMaterialCard = styled(MaterialCard)`
  padding: 0px;
  margin: 8px 16px;
`;

const StyledReactMde = styled(ReactMde)`
  min-height: 72px;
`;

const StyledButtonArea = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const StyledCardContentDiv = styled.div`
  width: 100%;
  padding: 0 8px;
  min-height: 72px;
  white-space: pre-line;
`;

export default Card;

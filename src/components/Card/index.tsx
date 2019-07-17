import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import CardEditor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markdown";
import Markdown from "markdown-to-jsx";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import { Draggable } from "react-beautiful-dnd";
import AppContainer from "../../State/AppContainer";

interface Props {
  filename: string;
  listIndex: number;
  cardIndex: number;
}

const KanbanCard: React.FC<Props> = props => {
  const { filename, listIndex, cardIndex } = props;

  const container = AppContainer.useContainer();
  const { text } = container.board[listIndex].list[cardIndex];

  const [isInputArea, setIsInputArea] = useState(false);

  const handleisInputAreaChange = () => {
    setIsInputArea(!isInputArea);
  };

  const handleOnValueChanged = (value: string) => {
    container.onCardTextChanged(listIndex, cardIndex, value);
  };

  const handleDeleteButtonClicked = () => {
    container.onCardDeleted(listIndex, cardIndex);
  };

  return (
    <Draggable draggableId={filename} index={cardIndex}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {isInputArea ? (
            <div>
              <StyledPaper>
                <StyledCodeEditor
                  value={text}
                  onValueChange={handleOnValueChanged}
                  highlight={code => highlight(code, languages.markdown, "md")}
                  padding={10}
                  autoFocus
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
            <StyledPaper>
              <StyledCardContentDiv onClick={handleisInputAreaChange}>
                <StyledMarkdownArea>{text}</StyledMarkdownArea>
              </StyledCardContentDiv>
            </StyledPaper>
          )}
        </div>
      )}
    </Draggable>
  );
};

const StyledPaper = styled(Paper)`
  padding: 0px;
  margin: 8px;
  cursor: pointer;
`;

const StyledCodeEditor = styled(CardEditor)`
  font-family: '"Fira code", "Fira Mono", monospace';
  font-size: 12;
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

const StyledMarkdownArea = styled(Markdown)`
  padding: 4px 8px;
`;

export default KanbanCard;

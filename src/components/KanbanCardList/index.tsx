import React, { useState } from "react";
import styled from "styled-components";
import uuidv1 from "uuid/v1";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import KanbanCardListTitleArea from "../KanbanCardListTitleArea";
import KanbanCard from "../KanbanCard";

interface CardListState {
  filename: string;
}

interface Props {
  filename: string;
  handleKanbanCardListDelete: (filename: string) => void;
}

const KanbanCardList: React.FC<Props> = props => {
  const { filename, handleKanbanCardListDelete } = props;

  const [title, setTitle] = useState("");
  const [cardList, setCardList] = useState<CardListState[]>([]);

  const deleteKanbanCard = (targetFilename: string) => {
    setCardList(prev => {
      return prev.filter(target => target.filename !== targetFilename);
    });
  };

  const handleAddButtonClicked = () => {
    setCardList(prev => [...prev, { filename: uuidv1() }]);
  };

  return (
    <StyledPaper>
      <KanbanCardListTitleArea
        filename={filename}
        value={title}
        setTitle={setTitle}
        handleKanbanCardListDelete={handleKanbanCardListDelete}
      />
      {cardList.map(card => (
        <KanbanCard
          key={card.filename}
          filename={card.filename}
          handleKanbanCardDelete={deleteKanbanCard}
        />
      ))}
      <StyledAddButtonArea>
        <Fab
          color="secondary"
          aria-label="Add"
          onClick={handleAddButtonClicked}
        >
          <AddIcon />
        </Fab>
      </StyledAddButtonArea>
    </StyledPaper>
  );
};

const StyledPaper = styled(Paper)`
  width: 360px;
  flex: 0 0 360px;
  margin: 16px;
`;

const StyledAddButtonArea = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export default KanbanCardList;

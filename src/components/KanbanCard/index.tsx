import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import CardEditor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markdown";
import Markdown from "markdown-to-jsx";

const KanbanCard: React.FC = () => {
  const [isInputArea, setIsInputArea] = useState(false);
  const [text, setText] = useState("");

  const handleisInputAreaChange = () => {
    setIsInputArea(!isInputArea);
  };

  return (
    <StyledPaper>
      {isInputArea ? (
        <StyledCodeEditor
          value={text}
          onValueChange={code => setText(code)}
          highlight={code => highlight(code, languages.markdown, "md")}
          padding={10}
          autoFocus
          onBlur={handleisInputAreaChange}
        />
      ) : (
        <StyledCardContentDiv onClick={handleisInputAreaChange}>
          <Markdown>{text}</Markdown>
        </StyledCardContentDiv>
      )}
    </StyledPaper>
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

const StyledCardContentDiv = styled.div`
  width: 100%;
  min-height: 72px;
  white-space: pre-line;
`;

export default KanbanCard;

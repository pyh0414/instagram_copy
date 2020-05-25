import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-top: 8px;
`;

const Contents = ({ contents }) => {
  return (
    <Wrapper>
      <div style={{ fontWeight: "bold", color: "black" }}>{contents}</div>
    </Wrapper>
  );
};

export default Contents;

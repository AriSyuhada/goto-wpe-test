import React from 'react';
import styled from '@emotion/styled';
import './App.css';
import { ContactList } from './components';

function App() {
  return (
    <div className="App">
      <StyledAppContainer>
        <ContactList />
      </StyledAppContainer>
    </div>
  );
}

export default App;

const StyledAppContainer = styled.div`
  background-color: #2a2f35;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;
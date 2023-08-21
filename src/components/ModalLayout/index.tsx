import styled from '@emotion/styled';
import React from 'react';
import {
  Close,
} from '@styled-icons/fa-solid';

interface PropsInterface {
  toggle: (isShow: boolean) => void,
  children?: React.ReactNode,
}

export default function ModalLayout(props: PropsInterface) {
  return (
    <StyledModalOverlay>
      <StyledModal>
        <StyledCloseButton size={30} title="close-modal-button" onClick={() => props.toggle(false)}>Close</StyledCloseButton>
        <StyledContentWrapper>
          {props.children}
        </StyledContentWrapper>
      </StyledModal>
    </StyledModalOverlay>
  )
}

const StyledModalOverlay = styled.div`
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow-y: scroll;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledModal = styled.div`
  position: relative;
  display: block;
  background-color: #202429;
  width: 70%;
  height: 70%;
  padding: 1rem;
  border-radius: 1rem;
  overflow: hidden;
`;

const StyledCloseButton = styled(Close)`
  color: #ffffff;
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const StyledContentWrapper = styled.div`
  margin: 0.6rem 1rem 2.4rem 1rem;
  height: 90%;
  overflow-y: auto;
`
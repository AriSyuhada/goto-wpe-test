import React from 'react';
import styled from '@emotion/styled';
import {
  ChevronRight,
  ChevronLeft,
} from '@styled-icons/fa-solid';

interface PropsInterface {
  currentPage: number,
  totalPost: number,
  contactPerPage: number,
  handlePaginate: (numbering: number) => void,
  handlePreviousPage: () => void,
  handleNextPage: () => void,
}

export default function Pagination(props: PropsInterface) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(props.totalPost / props.contactPerPage); i++) {
    pageNumbers.push(i);
  }

  const startPage = Math.max(props.currentPage - 2, 1);
  const endPage = Math.min(props.currentPage + 2, props.totalPost);

  return (
    <StyledPaginationComponent>
      <StyledPageButtonWrapper>
        <StyledNavPageButton onClick={() => props.handlePreviousPage()}>
          <StyledChevronLeft size="16" title="prev-button" />
        </StyledNavPageButton>
        {
          props.currentPage - 2 > 1 ?
            <StyledElipsis>...</StyledElipsis>
          :
            <></>
        }
        {
          pageNumbers.map((numbering) => (
            numbering >= startPage && numbering <= endPage ? 
              <StyledPageButton color={numbering === props.currentPage ? 'active' : 'default'} key={'page-'+numbering} onClick={() => props.handlePaginate(numbering)}>
                {numbering}
              </StyledPageButton>
            :
              <></>
          ))
        }
        {
          props.currentPage + 2 < pageNumbers.length ?
            <StyledElipsis>...</StyledElipsis>
          :
            <></>
        }
        <StyledNavPageButton onClick={() => props.handleNextPage()}>
          <StyledChevronRight size="16" title="next-button" />
        </StyledNavPageButton>
      </StyledPageButtonWrapper>
    </StyledPaginationComponent>
  );
}

const StyledPaginationComponent = styled.div`
  width: 100vw;
`;

const StyledPageButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem;
`;

const StyledChevronLeft = styled(ChevronLeft)`
  color: #ffffff;
`;
const StyledChevronRight = styled(ChevronRight)`
  color: #ffffff;
`;
const StyledNavPageButton = styled.button`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 2rem;
  border: 4px solid #ffffff;
  background-color: #202429;
`;
const StyledElipsis = styled.p`
  color: #ffffff;
  font-size: 1rem;
  font-weight: bolder;
  margin: 0;
`;
const StyledPageButton = styled.button`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 2rem;
  border: 4px solid ${(props) => (props.color === 'active' ? '#202429' : '#ffffff')};
  background-color: ${(props) => (props.color === 'active' ? '#ffffff' : '#202429')};
  color: ${(props) => (props.color === 'active' ? '#202429' : '#ffffff')};
  font-weight: bolder;
`;
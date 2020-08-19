import React from 'react';
import { ThumbsIcon } from '../UIUXUtils';
import { RecentFooterCtn, ButtonContainer, VoteButton, IconContainer } from './Reviews.styles';

const RecentReviewFooter = () => {
  return (
    <RecentFooterCtn>
      <span>Helpful?</span>
      <ButtonContainer>
        <VoteButton alignItems='center'>
          <IconContainer>
            <ThumbsIcon />
          </IconContainer>
            &nbsp;Yes
          </VoteButton>
        <VoteButton>
          <IconContainer>
            <ThumbsIcon isNegative={true} />
          </IconContainer>
            &nbsp;No
          </VoteButton>
        <VoteButton>😂 Funny</VoteButton>
        <VoteButton>🏆 Award</VoteButton>
      </ButtonContainer>
    </RecentFooterCtn>
  );
}

export default RecentReviewFooter;

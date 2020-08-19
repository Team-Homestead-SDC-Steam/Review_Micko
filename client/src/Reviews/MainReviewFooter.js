import React from 'react';
import PropTypes from 'prop-types';
import InfoTooltip from '../FilterMenu/InfoTooltip';
import { FlexDiv, ThumbsIcon } from '../UIUXUtils';
import { ReviewHelpfulQuestion, ButtonContainer, VoteButton, IconContainer, ReviewInfoContainer, CommentCount } from './Reviews.styles';

const MainReviewFooter = ({ numFoundHelpful = 0, numFoundFunny = 0, numComments = 0 }) => {
  let helpfulMsg = `${numFoundHelpful} ${numFoundHelpful === 1 ? 'person' : 'people'} found this review helpful`;
  let funnyMsg = `${numFoundFunny} ${numFoundFunny === 1 ? 'person' : 'people'} found this review funny`;

  return (
    <React.Fragment>
      <ReviewHelpfulQuestion>Was this review helpful?</ReviewHelpfulQuestion>
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
      {
        numFoundFunny + numFoundHelpful + numComments > 0 ?
          <ReviewInfoContainer
            flexDirection='row'
            justifyContent='space-between'
          >
            <FlexDiv flexDirection='column'>
              <span>{helpfulMsg}</span>
              <span>{funnyMsg}</span>
            </FlexDiv>
            {
              numComments > 0 ?
                <InfoTooltip
                  message='See Full Review'
                  width='fit-content'
                  wrap='false'
                  xOff={82}
                  yOff={35}
                >
                  <CommentCount data-testid='comment-count'>
                    {numComments}
                  </CommentCount>
                </InfoTooltip> :
                ''
            }
          </ReviewInfoContainer> :
          ''
      }
    </React.Fragment>
  );
};

MainReviewFooter.propTypes = {
  numFoundHelpful: PropTypes.number.isRequired,
  numFoundFunny: PropTypes.number.isRequired,
  numComments: PropTypes.number.isRequired
};

export default MainReviewFooter;

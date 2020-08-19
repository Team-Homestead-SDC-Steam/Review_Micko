import React from 'react';
import PropTypes from 'prop-types';
import RecentReviewHeader from './RecentReviewHeader';
import RecentReviewBody from './RecentReviewBody';
import RecentReviewFooter from './RecentReviewFooter';
import InfoTooltip from '../FilterMenu/InfoTooltip';
import { RecentReviewContainer } from './Reviews.styles';

const defaultReview = {
  is_recommended: true,
  hours_at_review_time: '0.0',
  purchase_type: 'direct',
  date_posted: '2020-06-01T00:00:00.000Z',
  review_text: 'No review is currently available.',
  user: {
    username: 'Error404NotFoundBoi'
  }
}

const RecentReview = ({ review = defaultReview }) => {
  return (
    <RecentReviewContainer>
      <InfoTooltip
        message='See Full Review'
        width='fit-content'
        wrap='false'
        yOff={5}
        xOff={0}
      >
        <RecentReviewHeader
          isRecommended={review.is_recommended}
          purchaseType={review.purchase_type}
          username={review.user.username}
          hoursReviewTime={review.hours_at_review_time}
        />
      </InfoTooltip>
      <RecentReviewBody
        datePosted={review.date_posted}
        review={review.review_text}
        receivedFree={review.received_free}
      />
      <RecentReviewFooter />
    </RecentReviewContainer>
  );
}

RecentReview.propTypes = {
  review: PropTypes.shape({
    is_recommended: PropTypes.bool.isRequired,
    received_free: PropTypes.bool.isRequired,
    hours_at_review_time: PropTypes.string.isRequired,
    purchase_type: PropTypes.oneOf(['direct', 'key']),
    date_posted: PropTypes.string.isRequired,
    review_text: PropTypes.string.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  })
};

export default RecentReview;

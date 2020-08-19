import React from 'react';
import PropTypes from 'prop-types';
import User from '../User/User';
import InfoTooltip from '../FilterMenu/InfoTooltip';
import MainReviewHeader from './MainReviewHeader';
import MainReviewBody from './MainReviewBody';
import MainReviewFooter from './MainReviewFooter';
import { ReviewContainer, Review } from './Reviews.styles';

const defaultReview = {
  is_recommended: true,
  hours_on_record: '0.0',
  hours_at_review_time: '0.0',
  purchase_type: 'direct',
  date_posted: '2020-01-01T00:00:00.000Z',
  received_free: false,
  review_text: 'No review available.',
  num_found_helpful: 420,
  num_found_funny: 421,
  num_comments: 422
};

const MainReview = ({ review = defaultReview }) => {
  return (
    <ReviewContainer flexDirection='row' data-testid='main-review'>
      <User
        info={review.user}
      />
      <Review flexDirection='column'>
        <InfoTooltip
          message='See Full Review'
          width='fit-content'
          wrap='false'
          yOff={5}
          xOff={0}
        >
          <MainReviewHeader
            isRecommended={review.is_recommended}
            hrsOnRecord={review.hours_on_record}
            hrsReviewTime={review.hours_at_review_time}
            purchaseType={review.purchase_type}
          />
        </InfoTooltip>
        <MainReviewBody
          datePosted={review.date_posted}
          review={review.review_text}
          receivedFree={review.received_free}
        />
        <MainReviewFooter
          numFoundHelpful={review.num_found_helpful}
          numFoundFunny={review.num_found_funny}
          numComments={review.num_comments}
        />
      </Review>
    </ReviewContainer>
  );
};

MainReview.propTypes = {
  review: PropTypes.shape({
    is_recommended: PropTypes.bool.isRequired,
    hours_on_record: PropTypes.string.isRequired, // Further validated in MainReviewHeader.js
    hours_at_review_time: PropTypes.string.isRequired, // Further validated in MainReviewHeader.js
    purchase_type: PropTypes.string.isRequired, // Further validated in MainReviewHeader.js
    date_posted: PropTypes.string.isRequired, // Further validated in MainReviewBody.js
    received_free: PropTypes.bool.isRequired,
    review_text: PropTypes.string.isRequired,
    num_found_helpful: PropTypes.number.isRequired,
    num_found_funny: PropTypes.number.isRequired,
    num_comments: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired, // Further validated in User.js
  })
};

export default MainReview;

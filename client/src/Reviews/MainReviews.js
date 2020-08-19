import React from 'react';
import PropTypes from 'prop-types';
import MainReview from './MainReview';
import { MainReviewsDiv, ReviewTypeInfo } from './Reviews.styles';

/**
 * A default prop is specified above so that default reviews are not recreated with every
 * function call, causing child components to rerender every time a parent rerenders, even if child
 * components have not changed.
 */
const MainReviews = ({ reviews = [{}]}) => {
  return (
    <MainReviewsDiv>
      <ReviewTypeInfo>
        Most helpful reviews
        <span> In the past 30 days</span>
      </ReviewTypeInfo>
      {
        reviews.map((review, idx) => (
          <MainReview
            key={idx}
            review={review}
          />
        ))
      }
    </MainReviewsDiv>
  );
};

MainReviews.propTypes = {
  reviews: PropTypes.array.isRequired
};

export default MainReviews;

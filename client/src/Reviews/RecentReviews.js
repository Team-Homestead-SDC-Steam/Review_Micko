import React from 'react';
import PropTypes from 'prop-types';
import RecentReview from './RecentReview'
import { ReviewTypeInfo, RecentReviewsAside } from './Reviews.styles';

const RecentReviews = ({ reviews }) => {
  return (
    <RecentReviewsAside>
      {
        reviews && reviews.length ?
          <React.Fragment>
            <ReviewTypeInfo>Recently Posted</ReviewTypeInfo>
            {
              reviews.map((review, idx) => (
                <RecentReview
                  key={idx}
                  review={review}
                />
              ))
            }
          </React.Fragment> :
          ''
      }

    </RecentReviewsAside>
  );
};

RecentReviews.propTypes = {
  reviews: PropTypes.array.isRequired
};

RecentReviews.defaultProps = {
  reviews: []
};

export default RecentReviews;

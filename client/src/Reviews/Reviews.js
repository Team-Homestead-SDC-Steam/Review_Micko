import React from 'react';
import PropTypes from 'prop-types';
import MainReviews from './MainReviews';
import RecentReviews from './RecentReviews';
import LoadingReviews from './LoadingReviews';
import { ReviewsContainer } from './Reviews.styles';

// If prop error, pass 1 empty review so that reviews aren't empty (rendered via MainReview.defaultProps)
const Reviews = ({ mainReviews = [{}], recentReviews = [], isFetching = false }) => {
  return (
    <ReviewsContainer
      flexDirection='row'
      flexWrap='nowrap'
      justifyContent='space-between'
    >
      {
        isFetching ?
          <LoadingReviews /> :
          <React.Fragment>
            <MainReviews
              reviews={mainReviews}
            />
            <RecentReviews
              reviews={recentReviews}
            />
          </React.Fragment>
      }
    </ReviewsContainer>
  );
};

Reviews.propTypes = {
  mainReviews: PropTypes.arrayOf(PropTypes.object).isRequired,
  recentReviews: PropTypes.array,
  isFetching: PropTypes.bool.isRequired
};

export default Reviews;

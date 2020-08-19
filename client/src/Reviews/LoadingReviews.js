import React from 'react';
import { LoadingContainer, LoadingBarContainer, Bar } from './Reviews.styles';

const LoadingReviews = () => {
  return (
    <LoadingContainer flexDirection='column'>
      <LoadingBarContainer flexDirection='row'>
        <Bar />
        <Bar delay='0.16s'/>
        <Bar delay='0.32s' />
      </LoadingBarContainer>
      <p>Loading Reviews...</p>
    </LoadingContainer>
  );
};

export default LoadingReviews;

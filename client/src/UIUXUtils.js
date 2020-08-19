// For styled components that are too small to have their own files, but are used repeatedly.
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// Modular flexbox parent <div> which accepts optional props to change flex behavior, to be used in multiple components
export const FlexDiv = styled.div`
  #${props => props.theme.rootId} & {
    display: ${props => props.display || 'flex'};
    flex-direction: ${props => props.flexDirection || 'row'};
    flex-wrap: ${props => props.flexWrap || 'nowrap'};
    justify-content: ${props => props.justifyContent || 'flex-start'};
    align-items: ${props => props.alignItems || 'stretch'};
    align-content: ${props => props.alignContent || 'stretch'};
  }
`;

export const BoldText = styled.span`
  #${props => props.theme.rootId} & {
    font-weight: ${props => props.weight ? props.weight : 'bold'};
  }
`;

export const EmphasisFont = styled.span`
  #${props => props.theme.rootId} & {
    font-family: 'Roboto', sans-serif;
  }
`;

export const NoSelect = styled.div`
  #${props => props.theme.rootId} & {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

// Thumbs up/down icon, used by MainReview and RecentReview
const ThumbsSVG = styled.svg`
  #${props => props.theme.rootId} & {
    fill: #4571a4;
    stroke: #16202d;
    stroke-width: 1;
    stroke-linecap: round;
    stroke-linejoin: round;
    ${props => props.isNegative ? 'transform: rotate(180deg);' : ''}
  }
`;

export const ThumbsIcon = ({ isNegative }) => {
  return (
    <ThumbsSVG
      viewBox='0 0 24 24'
      preserveAspectRatio='xMidYMid meet'
      isNegative={isNegative}
    >
      <path xmlns="http://www.w3.org/2000/svg" d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </ThumbsSVG>
  );
};

ThumbsIcon.propTypes = {
  isNegative: PropTypes.bool
};

ThumbsIcon.defaultProps = {
  isNegative: false
};

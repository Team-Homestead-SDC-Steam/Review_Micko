import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FilterTags from './FilterTags';
import { BoldText, EmphasisFont } from '../UIUXUtils';

const FilterInfoContainer = styled.div`
  #${props => props.theme.rootId} & {
    border-bottom: 1px solid #000;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
`;

const FilterScoreInfo = styled.div`
  #${props => props.theme.rootId} & {
    padding-top: 10px;
    font-size: 15px;
  }
`;

// Positive color: #66c0f4 (Overwhelmingly Positive, Mostly Positive, Very Positive)
// Mixed color: #b9a06a (Mixed)
// Negative color: #a34c25 (Overwhelmingly Negative, Mostly Negative, Very Negative)
const RatingText = styled(BoldText)`
  #${props => props.theme.rootId} & {
    color: ${props => props.context === 'Positive' ? '#66c0f4' : (props.context === 'Negative' ? '#a34c25' : '#b9a06a')};
    cursor: help;
  }
`;

const FilterInfo = ({ resetOption, filterOrder, activeFilters, gameSentiment, reviewCount }) => {
  return (
    <FilterInfoContainer>
      <FilterTags
        filterOrder={filterOrder}
        activeFilters={activeFilters}
        resetOption={resetOption}
      />
      <FilterScoreInfo>
        <EmphasisFont>
          Showing&nbsp;
          <BoldText weight={900}>{reviewCount}</BoldText>
          &nbsp;reviews that match the filters above
          ( <RatingText context={gameSentiment.split(' ').slice(-1)[0]}>{gameSentiment}</RatingText> )
        </EmphasisFont>
      </FilterScoreInfo>
    </FilterInfoContainer>
  );
};

FilterInfo.propTypes = {
  resetOption: PropTypes.func.isRequired,
  filterOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilters: PropTypes.object.isRequired,
  gameSentiment: PropTypes.string.isRequired,
  reviewCount: PropTypes.number.isRequired
};

FilterInfo.defaultProps = {
  resetOption: () => {},
  filterOrder: [],
  activeFilters: {},
  gameSentiment: 'Positive',
  reviewCount: 0
};

export default FilterInfo;

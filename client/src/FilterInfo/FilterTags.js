import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexDiv, EmphasisFont } from '../UIUXUtils';

const TitleLabel = styled.div`
  #${props => props.theme.rootId} & {
    font-size: 15px;
    color: #c6d4df;
    padding-bottom: 5px;
    margin-right: 5px;
  }
`;

const Tag = styled.div`
  #${props => props.theme.rootId} & {
    background-color: rgba(255, 255, 255, 0.2);
    padding: 5px;
    padding-right: 25px;
    margin: 0 5px 2.5px 2.5px;
    border-radius: 2px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-image: url(https://steamstore-a.akamaihd.net/public/images/v6/deleteSearchTerm.png);
    background-position: right 5px center;
  }
`;

const FilterTags = ({ resetOption, filterOrder, activeFilters }) => {
  let validTagsToBeDisplayed = filterOrder.filter(title => {
    return title !== 'Display As' && activeFilters[title];
  });

  /**
   * Get the appropriate tag name to display in Filter breadcrumbs beneath menu.
   * @param {String} title: one of [Review Type, Purchase Type, Language, Date Range, Playtime]
   * @param {String|Object} inputVal: if string, equal to displayed radio labels. If object, equal to a Playtime range
   * @param {Number} [inputVal.min]: minimum playtime if input val is object
   * @param {Number} [inputVal.max]: maximum playtime if input val is object
   */
  const getFilterTagDisplay = (title, inputVal) => {
    if (title !== 'Date Range' && typeof inputVal === 'string') {
      return inputVal === 'Other' ?
        'Not Purchased on Steam' : (
          title === 'Playtime' ?
            `Playtime: ${inputVal}` :
            inputVal
        );
    }
    if (title === 'Date Range') {
      return 'TODO: Hook up to review-graph api';
    }
    // Already checked for string inputVal above -- handle object inputVal here
    if (title === 'Playtime') {
      let returnStr = 'Playtime: ';
      if (inputVal.max === 100 && inputVal.min !== 100) {
        returnStr += 'Over ';
      }
      returnStr += `${inputVal.min} hour(s)`;
      if (inputVal.max === 100 && inputVal.min === 100 && !returnStr.includes('Over')) {
        returnStr += ' to No maximum';
      } else if (inputVal.max !== 100) {
        returnStr += ` to ${inputVal.max} hour(s)`;
      }
      return returnStr;
    }
  };

  return (
    <FlexDiv flexWrap={'wrap'} alignItems={'center'} data-testid="tags-wrapper">
      {
        validTagsToBeDisplayed.length ?
          <TitleLabel><EmphasisFont>Filters</EmphasisFont></TitleLabel> :
          ''
      }
      {
        validTagsToBeDisplayed.map((title, idx) => (
          <Tag
            key={idx}
            onClick={() => { resetOption(title); }}
            data-testid="filter-tag"
          >
            {getFilterTagDisplay(title, activeFilters[title])}
          </Tag>
        ))
      }
    </FlexDiv>
  );
};

FilterTags.propTypes = {
  resetOption: PropTypes.func.isRequired,
  filterOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilters: PropTypes.object.isRequired
};

FilterTags.defaultProps = {
  resetOption: () => {},
  filterOrder: [],
  activeFilters: {}
};

export default FilterTags;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FilterMenuUnit from './FilterMenuUnit';

/**
 * STYLED COMPONENTS
 */
const StyledMenu = styled.div`
  #${props => props.theme.rootId} & {
    margin-bottom: 30px;
    background-color: #1f2f42;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    position: relative;
    z-index: 300;
  }
`;

/**
 * MAIN COMPONENT
 */
const FilterMenu = ({ checkedOptions, updateCheckedOption, filterOrder, filterMenuOpts, filterMenuCounts, handleFilterChange }) => {
  return (
    <StyledMenu>
      {
        // Despite filterMenuOpts being a static object, object key order is not guaranteed, so
        // mapping with filterOrder ensures the order stays the same every time
        filterOrder.map((title, idx) => (
          <FilterMenuUnit
            data-testid="filter-menu-unit"
            checkedOption={checkedOptions[title]}
            updateCheckedOption={updateCheckedOption}
            title={title}
            key={idx}
            options={filterMenuCounts[title] || filterMenuOpts[title]}
            handleFilterChange={handleFilterChange}
          />
        ))
      }
    </StyledMenu>
  );
};

FilterMenu.propTypes = {
  checkedOptions: PropTypes.object.isRequired,
  updateCheckedOption: PropTypes.func.isRequired,
  filterOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterMenuOpts: PropTypes.object.isRequired,
  filterMenuCounts: PropTypes.object.isRequired,
  handleFilterChange: PropTypes.func.isRequired
};

FilterMenu.defaultProps = {
  checkedOptions: {},
  updateCheckedOption: () => {},
  filterOrder: [],
  filterMenuOpts: {},
  filterMenuCounts: {},
  handleFilterChange: () => {}
};

export default FilterMenu;

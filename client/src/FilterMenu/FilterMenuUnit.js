import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexDiv } from '../UIUXUtils';
import DropdownContent from './DropdownContent';

/**
 * STYLED COMPONENTS
 */
const MenuUnit = styled.div`
  #${props => props.theme.rootId} & {
    border-left: 1px solid #2a475e;
    padding-right: 10px;
    white-space: nowrap;
    ${({ isDisplayAs }) => (
      isDisplayAs ?
        `
          padding: 5px 0;
        ` :
        `
          :hover {
            background-color: #c6d4df;
          }
          :hover ${Dropdown} {
            visibility: visible;
          }
        `
    )}
  }
`;

const Title = styled.div`
  #${props => props.theme.rootId} & {
    text-transform: uppercase;
    font-size: 10px;
    color: #4582a5;
    padding: 5px 0 5px 10px;
  }
`;

const TitleWithArrow = styled(Title)`
  #${props => props.theme.rootId} & {
    padding: 10px;
    padding-right: 20px;
    cursor: pointer;
    background-image: url(https://steamstore-a.akamaihd.net/public/images/v6/btn_arrow_down_padded.png);
    background-repeat: no-repeat;
    background-position-y: center;
    background-position-x: right;
  }
`;

const StyledSelect = styled.select`
  #${props => props.theme.rootId} & {
    width: 100px;
    background: #4582a5;
    font-size: 12px;
    border: none;
    border-radius: 2px;
    outline: none;
    margin-left: 10px;
  }
`;

const Dropdown = styled.div`
  #${props => props.theme.rootId} & {
    background-color: #c6d4df;
    position: absolute;
    margin-top: 31.2px;
    padding: 10px;
    color: #556772;
    line-height: 20px;
    visibility: hidden;
    box-sizing: border-box;
    cursor: pointer;
  }
`;

/**
 * MAIN COMPONENT
 */
const FilterMenuUnit = ({ checkedOption, updateCheckedOption, title, options, handleFilterChange }) => {
  return (
    <MenuUnit
      isDisplayAs={title === 'Display As'} data-testid="menu-unit-wrapper"
    >
      {
        // If dropdown === Display as, display a title without arrow and a select dropdown
        title === 'Display As' ?
          (
            <FlexDiv alignItems={'center'} flexWrap={'wrap'}>
              <Title>{title}:</Title>
              <StyledSelect
                data-testid="display-as-select"
                onChange={(e) => updateCheckedOption(title, e.target.value)}
              >
                {
                  options.map((option, idx) => (
                    <option
                      value={option.toLowerCase().split(' ').join('-')}
                      key={idx}
                      data-testid={`option-${idx}`}
                    >
                      {option}
                    </option>)
                  )
                }
              </StyledSelect>
            </FlexDiv>
          ) :
          // Else display title with an arrow. Hovering over the title will display the dropdown
          (
            <FlexDiv flexWrap='wrap' flexDirection='column'>
              <TitleWithArrow>{title}</TitleWithArrow>
              <Dropdown id={`${title.toLowerCase().split(' ').join('-')}-dropdown`}>
                <DropdownContent
                  title={title}
                  options={options}
                  checkedOption={checkedOption}
                  updateCheckedOption={updateCheckedOption}
                  handleFilterChange={handleFilterChange}
                />
              </Dropdown>
            </FlexDiv>
          )
      }
    </MenuUnit>
  );
}

FilterMenuUnit.propTypes = {
  checkedOption: PropTypes.string.isRequired,
  updateCheckedOption: PropTypes.func.isRequired,
  title: PropTypes.oneOf(['Review Type', 'Purchase Type', 'Language', 'Date Range', 'Playtime', 'Display As']).isRequired,
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  handleFilterChange: PropTypes.func.isRequired
};

FilterMenuUnit.defaultProps = {
  checkedOption: '',
  updateCheckedOption: () => {},
  title: 'Review Type',
  options: {},
  handleFilterChange: () => {}
};

export default FilterMenuUnit;

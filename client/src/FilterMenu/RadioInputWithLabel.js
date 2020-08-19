import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexDiv } from '../UIUXUtils';
import InfoTooltip from './InfoTooltip';
import { addCommaToCount } from '../../utils';

const OptionCountSpan = styled.span`
  #${props => props.theme.rootId} & {
    color: #7193a6;
  }
`;

// Modular radio input (with label) component for filter menu dropdowns
const RadioInputWithLabel = ({ title = 'Review Type', option = '', checkedOption, count, handleChange = () => {}, tooltipMessage }) => {
  const menuUnitTitle = title.toLowerCase().split(' ').join('_');
  const menuUnitOption = option.toLowerCase().split(' ').join('_');

  return (
    <FlexDiv alignItems={'center'} data-testid="input-container">
      <input
        type="radio"
        value={option}
        name={menuUnitTitle}
        id={`${menuUnitTitle}_${menuUnitOption}`}
        checked={option === checkedOption}
        onChange={() => handleChange(title, option)}
        data-testid={`${menuUnitTitle}_${menuUnitOption}`}
      />
      <label htmlFor={`${menuUnitTitle}_${menuUnitOption}`}>
        &nbsp;{option}&nbsp;
        {
          count ?
            <OptionCountSpan>
              ({addCommaToCount(count)})
            </OptionCountSpan> :
            ''
        }
      </label>
      {
        tooltipMessage ?
          <InfoTooltip
            message={tooltipMessage}
            xOff={5}
            yOff={20}
          >
            <img
              style={{ paddingLeft: '5px' }}
              src="https://steamstore-a.akamaihd.net/public/shared/images/ico/icon_questionmark_dark.png"
              alt="tooltip-image"
            />
          </InfoTooltip> :
          ''
      }
    </FlexDiv>
  );
};

RadioInputWithLabel.propTypes = {
  title: PropTypes.string.isRequired,
  option: PropTypes.string.isRequired,
  checkedOption: PropTypes.string,
  count: PropTypes.number,
  handleChange: PropTypes.func.isRequired,
  tooltipMessage: PropTypes.string
};

export default RadioInputWithLabel;

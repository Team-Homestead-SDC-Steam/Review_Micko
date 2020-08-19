import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import RadioInputWithLabel from './RadioInputWithLabel';
import DoubleEndedSlider from './DoubleEndedSlider';

/**
 * STYLED COMPONENTS
 */
const CustomizeLanguageButton = styled.a`
  #${props => props.theme.rootId} & {
    text-transform: uppercase;
    color: #67c1f5;
    font-size: 10px;
    background: rgba(0, 0, 0, 0.5);
    padding: 3px 5px;
    border-radius: 2px;
    cursor: pointer;
    :hover {
      color: #fff;
      background: #67c1f5;
    }
  }
`;

const DateExplanation = styled.div`
  #${props => props.theme.rootId} & {
    white-space: normal;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #4582a5;
    max-width: 300px;
  }
`;

// Gradient: max browser compatibility
const ShowGraphButton = styled.button`
  #${props => props.theme.rootId} & {
    border-radius: 2px;
    border: none;
    padding: 1px 5px;
    display: inline-block;
    cursor: pointer;
    text-decoration: none;
    color: #a4d7f5;
    font-size: 12px;
    line-height: 20px;
    background: rgba(47, 137, 188, 1);
    background: -webkit-linear-gradient(
      to bottom,
      rgba(47, 137, 188, 1) 5%,
      rgba(23, 67, 92, 1) 95%
    );
    background: linear-gradient(
      to bottom,
      rgba(47, 137, 188, 1) 5%,
      rgba(23, 67, 92, 1) 95%
    );
    :hover {
      color: #fff;
      background: rgba(102, 192, 244, 1);
      background: -webkit-linear-gradient(
        to bottom,
        rgba(102, 192, 244, 1) 5%,
        rgba(47, 137, 188, 1) 95%
      );
      background: linear-gradient(
        to bottom,
        rgba(102, 192, 244, 1) 5%,
        rgba(47, 137, 188, 1) 95%
      );
    }
  }
`;

const SteamLabsDesc = styled.div`
  #${props => props.theme.rootId} & {
    cursor: pointer;
    color: #19c0d0;
    :hover {
      color: #fff;
    }
  }
`;

const SteamLabsLogo = styled.img`
  #${props => props.theme.rootId} & {
    height: 32px;
    margin-right: 5px;
  }
`;

const PlaytimeExplanation = styled.div`
  #${props => props.theme.rootId} & {
    width: 300px;
    white-space: normal;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #4582a5;
  }
`;

// Since slider is at a higher z-index & therefore exempt from dropdown
// height calcs, this div is necessary to ensure sufficient spacing below slider
const ZIndexWrapper = styled.div`
  #${props => props.theme.rootId} & {
    height: 45px;
    box-sizing: border-box;
    padding-top: 4px;
  }
`;

/**
 * MAIN COMPONENT: Modular dropdown menu
 */
const DropdownContent = ({ checkedOption = '', updateCheckedOption = () => {}, title = '', options = [], handleFilterChange = () => {} }) => {
  /**
   * STATIC VARIABLES
   */
  const isInitialMount = useRef(true);
  const tooltipMessages = {
    'Purchase Type': {
      'Steam Purchasers': 'These are reviews written by customers that purchased the game directly from Steam.',
      'Other': 'These are reviews written by customers that did not purchase the game on Steam. (This may include legitimate sources such as other digital stores, retail stores, testing purposes, or press review purposes. Or, from inappropriate sources such as copies given in exchange for reviews.)'
    },
    'Language': {
      'Your Languages': 'Your preferences are currently set to show content authored in these languages: English.\n\nClick customize below to modify your preferences.',
    }
  };

  /**
   * HANDLERS & EVENT HOOKS
   */
  // Updates filter tags in FilterInfo component on checkedOption update
  useEffect(() => {
    // Playtime handler logic is located in DoubleEndedSlider
    if (title !== 'Playtime') {
      // Prevent handleFilterChange from firing unnecessarily on component mount
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        handleFilterChange(title, checkedOption);
      }
    }
  }, [checkedOption]);

  return (
    <React.Fragment>
      {
        title === 'Date Range' ?
          <DateExplanation>
            To view reviews within a date range, please click and drag a selection on a graph above or click on a specific bar.
            <br />
            <br />
            <ShowGraphButton onClick={() => console.log('TODO: graph toggle pending review-graph module readiness')}>
              Show Graph
            </ShowGraphButton>
          </DateExplanation> :
          ''
      }
      {
        title === 'Playtime' ?
          <React.Fragment>
            <SteamLabsDesc>
              <SteamLabsLogo src="https://steamcdn-a.akamaihd.net/store/labs/main/images/steam_labs_logo.svg" alt="steam-labs-logo" />
              Brought to you by Steam Labs
            </SteamLabsDesc>
            <PlaytimeExplanation>
              Filter reviews by the user&apos;s playtime when the review was written:
            </PlaytimeExplanation>
          </React.Fragment> :
          ''
      }
      {
        // Since options are always passed as props in the same key order, Object.keys
        // is fine here despite objects not inherently having order to their key-value pairs
        (Array.isArray(options) ? options : Object.keys(options)).map((option, idx) =>
          <RadioInputWithLabel
            key={idx}
            title={title}
            option={option}
            checkedOption={checkedOption}
            count={!Array.isArray(options) ? options[option] : null}
            handleChange={updateCheckedOption}
            tooltipMessage={tooltipMessages[title] ? tooltipMessages[title][option] : null}
          />
        )
      }
      {
        title === 'Language' ? <CustomizeLanguageButton>Customize</CustomizeLanguageButton> : ''
      }
      {
        title === 'Playtime' ?
          <ZIndexWrapper>
            <DoubleEndedSlider
              checkedOption={checkedOption}
              updateOption={updateCheckedOption}
              handleFilterChange={handleFilterChange}
            />
          </ZIndexWrapper> :
          ''
      }
    </React.Fragment>
  );
};

DropdownContent.propTypes = {
  checkedOption: PropTypes.string.isRequired,
  updateCheckedOption: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  handleFilterChange: PropTypes.func.isRequired
}

export default DropdownContent;

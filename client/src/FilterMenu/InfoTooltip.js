import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

/**
 * STYLED COMPONENTS
 */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const TooltipDiv = styled.div`
  #${props => props.theme.rootId} & {
    position: absolute;
    bottom: ${props => `${props.y}px`};
    left: ${props =>`${props.x}px`};
    padding: 5px;
    box-sizing: border-box;
    max-width: 300px;
    width: ${props => props.width};
    background: #c2c2c2;
    color: #3d3d3f;
    box-shadow: 0 0 4px 0 #000;
    border-radius: 4px;
    white-space: ${props => props.wrap === 'true' ? 'pre-wrap' : 'nowrap'};
    word-wrap: break-word;
    font-size: 10px;
    line-height: 12px;
    display: inline-block;
    visibility: ${props => props.open ? 'visible' : 'hidden'};
    animation: ${props => props.open ? fadeIn : fadeOut} 0.1s linear;
    transition: visibility 0.1s linear;
  }
`;

const RelativeParentContainer = styled.div`
  #${props => props.theme.rootId} & {
    position: relative;
    font-family: Arial, Helvetica, sans-serif;
    z-index: 500;
  }
`;

/**
 * MAIN COMPONENT: Modular hover tooltip
 */
const InfoTooltip = ({ message = '', xOff = 5, yOff = 20, children = <div></div>, width = '300px', wrap = 'true' }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <React.Fragment>
      <RelativeParentContainer>
        <TooltipDiv
          x={xOff}
          y={yOff}
          open={tooltipOpen}
          width={width}
          wrap={wrap}
        >
          {message}
        </TooltipDiv>
      </RelativeParentContainer>
      <div
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

InfoTooltip.propTypes = {
  message: PropTypes.string.isRequired,
  xOff: PropTypes.number,
  yOff: PropTypes.number,
  children: PropTypes.element,
  width: PropTypes.string,
  wrap: PropTypes.oneOf(['true', 'false'])
};

export default InfoTooltip;

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { BoldText, NoSelect } from '../UIUXUtils';

/**
 * STYLED COMPONENTS
 */
const RangeInput = styled.input`
  #${props => props.theme.rootId} & {
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    -webkit-appearance: none;
    visibility: hidden;
    :focus {
      outline: none;
    }
    &::-webkit-slider-thumb, &::-moz-range-thumb, &::-ms-thumb {
      pointer-events: none;
      border: none;
      -webkit-appearance: none;
    }
  }
`;

const SliderContainer = styled(NoSelect)`
  #${props => props.theme.rootId} & {
    margin: 10px;
    height: auto;
    cursor: pointer;
    position: relative;
  }
`;

const SliderTrack = styled(NoSelect)`
  #${props => props.theme.rootId} & {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    height: 4px;
    margin-top: -2px;
    z-index: 1;
  }
`;

const SliderRange = styled(NoSelect)`
  #${props => props.theme.rootId} & {
    position: absolute;
    top: 0;
    background: #4582a5;
    height: 4px;
    margin-top: -2px;
    z-index: 2;
    pointer-events: none;
  }
`;

const SliderThumb = styled(NoSelect).attrs(props => ({
  style: {
    left: `${props.left}%`,
    zIndex: props.isLastDragged ? '4' : '3'
  }
}))`
  #${props => props.theme.rootId} & {
    margin-top: -2px;
    width: 14px;
    height: 14px;
    border-radius: 7px;
    box-shadow: 0px 0px 4px 0px #000000;
    position: absolute;
    top: -0.4em;
    margin-left: -0.6em;
    cursor: pointer;
    background: ${props => props.isLastDragged ? '#fdf5ce' : '#f6f6f6'};
    &:hover {
      background: #f6f6f6;
    }
  }
`;

/**
 * MAIN COMPONENT:
 * A slider UI which sets values on 2 invisible range inputs.
 * Due to lack of support for multi-thumb inputs & disallowance of external
 * libraries, this is my implementation from scratch.
 */
const DoubleEndedSlider = ({ checkedOption, updateOption, handleFilterChange }) => {
  const sliderThumbIds = [1, 2];
  /**
   * UI STATE
   */
  const [sliderDisplay, setSliderDisplay] = useState({ min: 'No Minimum', max: 'No Maximum' });
  const [lastDraggedThumbId, setLastDraggedThumbId] = useState(null);
  const [sliderMinMaxVals, setSliderMinMaxVals] = useState({ min: 0, max: 100 });
  const [sliderRange, setSliderRange] = useState({ left: 0, width: 100 });
  const [sliderBoundaries, setSliderBoundaries] = useState({
    min: 0,
    max: 0,
    width: 0
  });
  const [isDragging, setIsDragging] = useState({
    min: false,
    max: false
  });

  const isInitialMount = useRef(true);

  /**
   * HOOKS AND HANDLERS
   */
  // Set slider boundaries & starting slider range on component mount
  useEffect(() => {
    let { x: sX, width: sWidth } = document.getElementById('slider-track').getBoundingClientRect();
    setSliderBoundaries({
      min: sX,
      max: sX + sWidth,
      width: sWidth
    });
    setSliderRange({
      left: 0,
      width: 100
    });
  }, []);

  /**
   * Updates slider display, default 'No minimum to No maximum'
   * @param {Object} sliderMinMaxVals
   * @param {Number} sliderMinMaxVals.min
   * @param {Number} sliderMinMaxVals.max
   */
  const updateSliderDisplay = ({ min, max }) => {
    setSliderDisplay({
      min: min === 0 ? 'No minimum' : `${min} hour(s)`,
      max: max === 0 || max === 100 ? 'No maximum' : `${max} hour(s)`
    });
  };

  // Update display on sliderMinMaxVals change
  useEffect(() => {
    updateSliderDisplay(sliderMinMaxVals);
    setSliderRange({
      left: sliderMinMaxVals.min,
      width: sliderMinMaxVals.max - sliderMinMaxVals.min
    });
    if (!isDragging.min && !isDragging.max && !isInitialMount.current) {
      handleFilterChange('Playtime', sliderMinMaxVals);
    }
  }, [sliderMinMaxVals]);

  // Update slider-range div styles on sliderRange change
  useEffect(() => {
    let range = document.getElementById('slider-range');
    range.style.left = `${sliderRange.left}%`;
    range.style.width = `${sliderRange.width}%`;
  }, [sliderRange]);

  // Update slider range & thumbs on parent component radio input
  useEffect(() => {
    const match = checkedOption.match(/(\d+)/);
    // Since min & max thumbs are in same position for 100 hrs, ensure min thumb has higher z-index
    match && match[0] === '100' && setLastDraggedThumbId(1);
    if (match) {
      setSliderMinMaxVals({
        min: parseInt(match[0]),
        max: 100
      });
    } else if (checkedOption === 'No Minimum') {
      setSliderMinMaxVals({
        min: 0,
        max: 100
      });
    }
  }, [checkedOption]);

  /**
  * Given current dragged position, compute percentage from left of parent
  * given pre-computed parent boundaries
  * @param {Float} curX
  * @param {Number} id
  * @returns {Number} percent integer between 0 and 100
  */
  const computeLeftPercent = (curX, id) => {
    curX = curX < sliderBoundaries.min ?
      0 : (
        curX > sliderBoundaries.max ?
          sliderBoundaries.max :
          curX
      );
    let percent = Math.round((curX - sliderBoundaries.min) / (sliderBoundaries.width || 1) * 100);

    // Constrain percent to be between 0 and 100.
    // If percent is for min value, constrain to be between 0 and current max value
    // If percent is for max value, constrain to be between min value and percent
    if (id === sliderThumbIds[0]) {
      percent >= sliderMinMaxVals.max ? percent = sliderMinMaxVals.max : 0;
    } else {
      percent <= sliderMinMaxVals.min ? percent = sliderMinMaxVals.min : 0;
    }
    return percent < 0 ?
      0 : (
        percent > 100 ?
          100 :
          percent
      );
  };

  /**
   * Ensures that drag only occurs with left click held down & valid dragged thumb id
   * (.buttons for Chrome/Safari, .which for FireFox, 1 = left click)
   * @param {Object} e : HTML Event
   */
  const handleDrag = (e) => {
    if ((isDragging.min || isDragging.max) && (e.buttons === 1 || e.which === 1)) {
      if (sliderThumbIds.includes(lastDraggedThumbId)) {
        setSliderMinMaxVals(prevVals => ({
          ...prevVals,
          [lastDraggedThumbId === sliderThumbIds[0] ? 'min' : 'max']: computeLeftPercent(e.pageX, lastDraggedThumbId)
        }));
        return;
      }
    }
    document.removeEventListener('mousemove', handleDrag);
  };

  /**
   * Fires on mouseup
   */
  const handleDragEnd = () => {
    setIsDragging({ min: false, max: false });
  };

  /**
   * Fires on mousedown on slider thumb
   * @param {Number} id: slider thumb id, default either 1 or 2
   */
  const handleDragStart = (id) => {
    // Set input radio value to empty string
    updateOption('');

    setLastDraggedThumbId(id);
    setIsDragging({ [id === sliderThumbIds[0] ? 'min' : 'max']: true, [id === sliderThumbIds[1] ? 'min' : 'max']: false });
  };

  /**
   * Adds event listener while dragging. Event listeners will self-remove
   * if proper conditions are not met on next event fire (and mouseup event
   * only triggers once, then auto-self-removes)
   *
   * When not isDragging, updates hidden uncontroller input values for use with
   * server GET requests.
   */
  useEffect(() => {
    if (isDragging.min || isDragging.max) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd, { once: true });
    } else {
      // Prevent handleFilterChange from firing unnecessarily on component mount
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        handleFilterChange('Playtime', sliderMinMaxVals);
      }
    }
  }, [isDragging]);

  /**
   * Returns closest slider thumb
   * @param {Number} pageX: HTML Event's x position
   * @returns {Number}: id (default 1 or 2) of closest thumb
   */
  const getClosestThumbToClick = (pageX) => {
    let { x: t1X } = document.getElementById(`slider-thumb-${sliderThumbIds[0]}`).getBoundingClientRect();
    let { x: t2X } = document.getElementById(`slider-thumb-${sliderThumbIds[1]}`).getBoundingClientRect();
    return Math.abs(pageX - t1X) <= Math.abs(pageX - t2X) ? sliderThumbIds[0] : sliderThumbIds[1];
  };

  /**
   * Sets playtime filter range, changing either min or max depending on
   * which thumb the point clicked was closer to
   * @param {Object} e: HTML Event
   * @param {Float} e.pageX: x position on page of click
   */
  const handleSliderClick = ({ pageX }) => {
    let closestThumb = getClosestThumbToClick(pageX);
    // TODO: Clicking
    setSliderMinMaxVals(prevVals => ({
      ...prevVals,
      [closestThumb === sliderThumbIds[0] ? 'min' : 'max']: computeLeftPercent(pageX, closestThumb)
    }));
  };

  /**
   * EVENT & USEEFFECT HOOK FLOW (for code reviewer):
   * Case 1: MOUNT
   *        -> useEffect hook on mount - setSliderBoundaries using rendered (but visibility:hidden) slider-track div's position
   *                                   - setSliderRange to initial values of { left: 0, width: 100 }
   *                                   - sliderRange state change triggers relevant styled-component update via passed props
   * Case 2: EVENT: User clicks a slider thumb
   *        -> setLastDraggedThumbId to current slider thumb's id (default 1 or 2)
   *        -> setIsDragging of current id to true
   *        -> useEffect hook for isDragging - if isDragging one of two thumbs, add mousemove, mouseup event listeners to handle drag behavior
   * Case 3: EVENT: User moves a slider thumb while clicking (mousedown + mousemove)
   *        -> while dragging with left click and valid thumb id state, update slider min & max (sliderMinMaxVals)
   *        -> dragged thumb position updated to follow mouse via sliderMinMaxVals state passed as styled-component props
   *        -> useEffect hook for sliderMinMaxVals - updates slider display to reflect new range
   *                                               - setSliderRange to update foreground blue bar
   *        -> useEffect hook for sliderRange - updates range state
   *                                          - updates range style via direct DOM change (can also do styled components but chose not to)
   * Case 4: EVENT: User mouseup after drag
   *        -> handleDragEnd triggers once on mouseup, then self-removes ({ once: true })
   *        -> setIsDragging all values to false
   *        -> useEffect hook for isDragging - isDragging's vals are both false, so update invisible range values
   *        -> TODO once server PR merges: trigger a GET request (via props function) with new filter params
   * Case 5: EVENT: User mousemove after mouseup
   *        -> handleDrag triggers, but since isDragging's vals are both false, handleDrag self-removes from event listeners for document
   * Case 6: EVENT: User clicks on slider track
   *        -> get and set the closest thumb equal to the event's x position
   *        -> useEffect hook for sliderMinMaxVals triggers (same effects as above)
   *        -> useEffect hook for sliderRange triggers (same effects as above)
   * Case 7: EVENT: User clicks on radio input in parent component
   *        -> if radio input is 'Over 100 hours', update lastDraggedThumbId to ensure proper z-index
   *        -> Update sliderMinMaxValues, which triggers the same useEffect hooks as above
   */
  return (
    <React.Fragment>
      {/*
        Slider display: No Minimum -> No minimum, ditto for maximum.
        Necessary for data to match between this component and the radio input in the parent Playtime component.
      */}
      <NoSelect>
        <BoldText>{sliderDisplay.min}</BoldText> to <BoldText>{sliderDisplay.max}</BoldText>
      </NoSelect>

      <SliderContainer id="slider">
        {/*
          Uncontrolled, hidden (visibility: hidden) inputs, for communication with server only.
          Not meant to be part of UI, though it IS rendered.
         */}
        <RangeInput
          type="range"
          id="range-min"
          min="0"
          max="100"
          value={sliderMinMaxVals.min}
          isMin={true}
          readOnly
          data-testid="input-1"
        />
        <RangeInput
          type="range"
          id="range-max"
          min="0"
          max="100"
          value={sliderMinMaxVals.max}
          isMin={false}
          readOnly
          data-testid="input-2"
        />
        {/*
          Input-representing double-ended slider. Does not interact with server, but user interaction changes
          input values of range sliders directly under it.

          Track: White background bar, showing unselected range area(s)
          Range: Blue foreground bar, showing selected range area. Always bounded by two thumbs.
          Thumbs: two circular handles for changing range.
        */}
        <SliderTrack
          id="slider-track"
          onClick={handleSliderClick}
          data-testid="slider-track"
        />
        <SliderRange
          id="slider-range"
          data-testid="slider-range"
        />
        <SliderThumb
          draggable="false"
          id={`slider-thumb-${sliderThumbIds[0]}`}
          left={sliderMinMaxVals.min}
          isMin={true}
          isLastDragged={lastDraggedThumbId === sliderThumbIds[0]}
          onMouseDown={() => handleDragStart(sliderThumbIds[0])}
          data-testid="slider-thumb-1"
        />
        <SliderThumb
          draggable="false"
          id={`slider-thumb-${sliderThumbIds[1]}`}
          left={sliderMinMaxVals.max}
          isMin={false}
          isLastDragged={lastDraggedThumbId === sliderThumbIds[1]}
          onMouseDown={() => handleDragStart(sliderThumbIds[1])}
          data-testid="slider-thumb-2"
        />
      </SliderContainer>
    </React.Fragment>
  );
};

DoubleEndedSlider.propTypes = {
  checkedOption: PropTypes.oneOf(['', 'No Minimum', 'Over 1 hour', 'Over 10 hours', 'Over 100 hours']).isRequired,
  updateOption: PropTypes.func.isRequired,
  handleFilterChange: PropTypes.func.isRequired
};

DoubleEndedSlider.defaultProps = {
  checkedOption: 'No Minimum',
  updateOption: () => {},
  handleFilterChange: () => {}
};

export default DoubleEndedSlider;

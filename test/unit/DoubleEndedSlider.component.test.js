import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DoubleEndedSlider from '../../client/src/FilterMenu/DoubleEndedSlider';

describe('<DoubleEndedSlider /> tests', () => {
  // This test suite will be the extent of DoubleEndedSlider's unit, or even integration
  // testing. This is because DoubleEndedSlider uses a real DOM  with positioning
  // methods in its mount, which Jest's jsdom env does not support. See this issue:
  // https://stackoverflow.com/questions/59360989/working-with-dom-elements-in-react-testing-library
  // This SO post recommends using a headless browser (E2E) for tests. Thus
  // DoubleEndedSlider's test suite will be excluded from coverage until
  // E2E tests are set up with Cypress. TODO: finish DoubleEndedSlider tests using E2E testing
  test('when passed default args, mounts with expected display', () => {
    render(<DoubleEndedSlider
      checkedOption={'No Minimum'}
      updateCheckedOption={() => {}}
      handleFilterChange={() => {}}
    />);

    // Display:
    // separated by spans around 'No minimum' and 'No maximum', therefore
    // getting them together won't work, as they aren't in the same DOM node
    expect(screen.getByText('No minimum')).toBeInTheDocument();
    expect(screen.getByText('to')).toBeInTheDocument();
    expect(screen.getByText('No maximum')).toBeInTheDocument();

    // Actual range inputs
    let input1 = screen.getByTestId('input-1');
    let input2 = screen.getByTestId('input-2');
    expect(input1).toBeInTheDocument();
    expect(input2).toBeInTheDocument();
    expect(input1).toHaveValue('0');
    expect(input2).toHaveValue('100');

    // Visible fake CSS slider
    expect(screen.getByTestId('slider-track')).toBeInTheDocument();
    expect(screen.getByTestId('slider-range')).toBeInTheDocument();
    expect(screen.getByTestId('slider-thumb-1')).toBeInTheDocument();
    expect(screen.getByTestId('slider-thumb-2')).toBeInTheDocument();

  });
});

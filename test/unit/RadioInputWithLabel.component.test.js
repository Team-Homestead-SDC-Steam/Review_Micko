/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RadioInputWithLabel from '../../client/src/FilterMenu/RadioInputWithLabel';

// Mocked components, utils
jest.mock('../../client/src/FilterMenu/InfoTooltip', () => {
  return ({ message }) => (
    <div>{message}</div>
  );
});

jest.mock('../../client/utils', () => {
  return {
    addCommaToCount: (count) => count + 1
  };
});

describe('<RadioInputWithLabel /> tests', () => {
  // Wrapped asserts for reusability
  /**
   * @param {String} labeText
   * @param {Number} [count]
   */
  const assertValidLabel = (labelText, count) => {
    let label = screen.getByText(labelText, { exact: false });
    if (count !== undefined) {
      let countSpan = screen.getByText(`(${count})`);
      expect(label).toContainElement(countSpan);
    } else {
      expect(label).toBeInTheDocument();
      expect(label.children.length).toBe(0);
    }
  };

  /**
   * @param {Object} radioNode: HTMLElement
   * @param {Boolean} checked
   */
  const assertValidRadio = (labelText, checked) => {
    let radioInput = screen.getByLabelText(labelText, { exact: false });
    expect(radioInput).toBeInTheDocument();
    checked ? expect(radioInput).toBeChecked() : expect(radioInput).not.toBeChecked();
  };

  /**
   * @param {String} [tooltipMessage]
   */
  const assertValidTooltip = (tooltipMessage) => {
    if (tooltipMessage !== undefined) {
      expect(screen.getByText(tooltipMessage)).toBeInTheDocument();
    } else {
      // Input, label, no tooltip div = 2 children
      expect(screen.getByTestId('input-container').children.length).toBe(2);
    }
  };

  // Test suites
  test('renders a checked radio input component with all passed props', () => {
    render(<RadioInputWithLabel
      title='Test title'
      option='Test option'
      checkedOption='Test option'
      count={300}
      handleChange={() => {}}
      tooltipMessage={'Test message'}
    />);

    assertValidLabel('Test option', 301);
    assertValidRadio('Test option', true);
    assertValidTooltip('Test message');
  });

  test('renders an unchecked radio input component with all passed props', () => {
    render(<RadioInputWithLabel
      title='Test title'
      option='Test option'
      checkedOption='Not test option'
      count={300}
      handleChange={() => {}}
      tooltipMessage={'Test message'}
    />);

    assertValidLabel('Test option', 301);
    assertValidRadio('Test option', false);
    assertValidTooltip('Test message');
  });

  test('renders a radio input component without count prop', () => {
    render(<RadioInputWithLabel
      title='Test title'
      option='Test option'
      checkedOption='Test option'
      handleChange={() => {}}
      tooltipMessage={'Test message'}
    />);

    assertValidLabel('Test option');
    assertValidRadio('Test option', true);
    assertValidTooltip('Test message');
  });

  test('renders a radio input without tooltip message prop', () => {
    render(<RadioInputWithLabel
      title='Test title'
      option='Test option'
      checkedOption='Test option'
      count={300}
      handleChange={() => {}}
    />);

    assertValidLabel('Test option', 301);
    assertValidRadio('Test option', true);
    assertValidTooltip();
  });

  // checkedOption may be changed without clicking off an input
  test('updates display based on changes to parent checkedOption state', () => {
    const { rerender } = render(<RadioInputWithLabel
      title='Test title'
      option='Test option'
      checkedOption='Test option'
      handleChange={() => {}}
    />);

    assertValidRadio('Test option', true);

    // NOTE: rerender does NOT remember unchanged old props. All props must be passed again
    rerender(<RadioInputWithLabel
      title='Test title'
      option='Test option'
      checkedOption='Not test option'
      handleChange={() => {}}
    />);

    assertValidRadio('Test option', false);
  });

  test('propagates changes to parent component using handleChange on change', () => {
    // Mocked onChange event handler
    const handleChange = jest.fn();

    render(
      <React.Fragment>
        <RadioInputWithLabel
          title='a'
          option='0'
          checkedOption='4'
          handleChange={handleChange}
        />
        <RadioInputWithLabel
          title='a'
          option='1'
          checkedOption='4'
          handleChange={handleChange}
        />
        <RadioInputWithLabel
          title='a'
          option='2'
          checkedOption='4'
          handleChange={handleChange}
        />
        <RadioInputWithLabel
          title='a'
          option='3'
          checkedOption='4'
          handleChange={handleChange}
        />
      </React.Fragment>
    );

    for (let i = 0; i <= 3; i++) {
      fireEvent.click(screen.getByLabelText(i.toString(), { exact: false }));
      expect(handleChange).toHaveBeenCalledWith('a', i.toString());
    }
    expect(handleChange).toHaveBeenCalledTimes(4);
  });
});

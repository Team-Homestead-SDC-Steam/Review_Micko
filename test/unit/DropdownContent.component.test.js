import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DropdownContent from '../../client/src/FilterMenu/DropdownContent';

jest.mock('../../client/src/FilterMenu/RadioInputWithLabel', () => {
  return ({ title, option, count, tooltipMessage }) => (
    <div>
      <div>{title} - {option}</div>
      <div>{count}</div>
      <div>{tooltipMessage}</div>
    </div>
  );
});

jest.mock('../../client/src/FilterMenu/DoubleEndedSlider', () => {
  return () => (
    <div>Mock DoubleEndedSlider</div>
  );
});

describe('<DropdownContent /> tests', () => {
  const mockedOptionsForTitles = {
    'Review Type': {
      'All': 1,
      'Positive': 2,
      'Negative': 3
    },
    'Purchase Type': {
      'All': 4,
      'Steam Purchasers': 5,
      'Other': 6
    },
    'Language': {
      'All Languages': 7,
      'Your Languages': 8
    },
    'Date Range': ['Lifetime', 'Only Specific Range (Select on graph above)', 'Exclude Specific Range (Select on graph above)'],
    'Playtime': ['No Minimum', 'Over 1 hour', 'Over 10 hours', 'Over 100 hours'],
  };

  // Mocked asserts for reusability
  /**
   * @param {String} title
   * @param {Object|Array} options
   */
  const assertMockedRadioInputsExist = (title, options) => {
    (Array.isArray(options) ? options : Object.keys(options)).forEach(key => {
      expect(screen.getByText(`${title} - ${key}`)).toBeInTheDocument();
      if (!Array.isArray(options)) {
        expect(screen.getByText(`${options[key]}`)).toBeInTheDocument();
      }
    });
  };

  // Test suites
  test('renders all types of Dropdowns correctly', () => {
    let title = 'Review Type';
    let options = mockedOptionsForTitles[title];

    const { rerender } = render(<DropdownContent
      checkedOption='checkedOption'
      updateCheckedOption={() => {}}
      title={title}
      options={options}
      handleFilterChange={() => {}}
    />);

    assertMockedRadioInputsExist(title, options);

    ['Purchase Type', 'Language', 'Date Range', 'Playtime'].forEach(ttl => {
      title = ttl;
      options = mockedOptionsForTitles[title];

      rerender(<DropdownContent
        checkedOption='checkedOption'
        updateCheckedOption={() => {}}
        title={title}
        options={options}
        handleFilterChange={() => {}}
      />);

      assertMockedRadioInputsExist(title, options);

      if (title === 'Language') {
        expect(screen.getByText('Customize')).toBeInTheDocument();
      }

      if (title === 'Date Range') {
        expect(screen.getByText('To view reviews within a date range,', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('Show Graph')).toBeInTheDocument();
      }

      if (title === 'Playtime') {
        let steamLabsLogo = screen.getByAltText('steam-labs-logo');
        expect(steamLabsLogo).toBeInTheDocument();
        expect(steamLabsLogo).toHaveAttribute('src', 'https://steamcdn-a.akamaihd.net/store/labs/main/images/steam_labs_logo.svg');
        expect(screen.getByText('Brought to you by Steam Labs')).toBeInTheDocument();
        expect(screen.getByText('Filter reviews by the user\'s playtime', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('Mock DoubleEndedSlider')).toBeInTheDocument();
      }
    });
  });

  test('fires handleFilterChange when checkedOption is changed', () => {
    const mockedHandle = jest.fn();

    const { rerender } = render(<DropdownContent
      checkedOption='checkedOption'
      updateCheckedOption={() => {}}
      title={'Purchase Type'}
      options={mockedOptionsForTitles['Purchase Type']}
      handleFilterChange={mockedHandle}
    />);

    rerender(<DropdownContent
      checkedOption='newCheckedOption'
      updateCheckedOption={() => {}}
      title={'Purchase Type'}
      options={mockedOptionsForTitles['Purchase Type']}
      handleFilterChange={mockedHandle}
    />);

    expect(mockedHandle).toHaveBeenCalledWith('Purchase Type', 'newCheckedOption');
  });

  test('TODO: TEMPORARILY calls a console.log on clicking Show Graph button', () => {
    render(<DropdownContent
      checkedOption='checkedOption'
      updateCheckedOption={() => {}}
      title={'Date Range'}
      options={mockedOptionsForTitles['Date Range']}
      handleFilterChange={() => {}}
    />);

    console.log = jest.fn();
    fireEvent.click(screen.getByText('Show Graph'));
    expect(console.log).toHaveBeenCalledWith('TODO: graph toggle pending review-graph module readiness');
  });
});
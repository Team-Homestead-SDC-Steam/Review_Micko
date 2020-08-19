import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FilterTags from '../../client/src/FilterInfo/FilterTags';

describe('<FilterTags /> tests', () => {
  const filterOrder = ['Review Type', 'Purchase Type', 'Language', 'Date Range', 'Playtime', 'Display As'];
  let defaultFilters = {
    'Review Type': null,
    'Purchase Type': null,
    'Language': null,
    'Date Range': null,
    'Playtime': null,
    'Display As': null
  };
  let activeFilters;

  beforeEach(() => {
    activeFilters = { ...defaultFilters };
  });

  /**
   * @param {Number} numTags
   * @param {Array} expectedVals
   */
  const assertValidTagDisplayAndOrder = (numTags, expectedVals) => {
    let filters = screen.getAllByTestId('filter-tag');
    expect(filters.length).toBe(numTags);
    expectedVals.forEach((expected, idx) => {
      expect(filters[idx].textContent).toBe(expected);
    });
  };

  // Test suites
  test('renders default activeFilters as tags according to filterOrder', () => {
    activeFilters['Language'] = 'Your Languages';
    render(<FilterTags
      resetOption={() => {}}
      filterOrder={filterOrder}
      activeFilters={activeFilters}
    />);

    assertValidTagDisplayAndOrder(1, ['Your Languages']);
  });

  test('renders tags in the correct format', () => {
    const { rerender } = render(<FilterTags
      resetOption={() => {}}
      filterOrder={filterOrder}
      activeFilters={activeFilters}
    />);

    let possibleFilters = {
      'Review Type': ['Positive', 'Negative'],
      'Purchase Type': ['Steam Purchasers', 'Other'],
      'Language': ['Your Languages'],
      'Date Range': ['Only Specific Range (Select on graph above)', 'Exclude Specific Range (Select on graph above)'],
      'Playtime': ['Over 1 hour', 'Over 10 hours', 'Over 100 hours'],
      'Display As': ['summary', 'helpful', 'recent', 'funny']
    };
    let expectedDisplays = {
      'Review Type': possibleFilters['Review Type'],
      'Purchase Type': ['Steam Purchasers', 'Not Purchased on Steam'],
      'Language': possibleFilters['Language'],
      'Date Range': ['TODO: Hook up to review-graph api', 'TODO: Hook up to review-graph api'],
      'Playtime': possibleFilters['Playtime'].map(f => `Playtime: ${f}`),
    };

    for (let title in possibleFilters) {
      possibleFilters[title].forEach((filter, idx) => {
        activeFilters = { ...defaultFilters };
        activeFilters[title] = filter;

        rerender(
          <FilterTags
            resetOption={() => { }}
            filterOrder={filterOrder}
            activeFilters={activeFilters}
          />
        );
        if (title !== 'Display As') {
          assertValidTagDisplayAndOrder(1, [expectedDisplays[title][idx]]);
        } else {
          // Display As does not show filter tags
          expect(screen.getByTestId('tags-wrapper').children.length).toBe(0);
        }
      });
    }
  });

  test('renders tags in the correct order', () => {
    let expectedOrder = [
      'Positive',
      'Steam Purchasers',
      'Your Languages',
      'TODO: Hook up to review-graph api',
      'Over 10 hours'
    ];

    // length - 1 as Display As title will never show as a tag
    for (let i = 0; i < filterOrder.length - 1; i++) {
      activeFilters[filterOrder[i]] = expectedOrder[i];
    }

    render(<FilterTags
      resetOption={() => {}}
      filterOrder={filterOrder}
      activeFilters={activeFilters}
    />);

    assertValidTagDisplayAndOrder(5, expectedOrder.map((val, idx) => idx === 4 ? `Playtime: ${val}` : val));
  });

  test('renders correctly when inputVal is not a string (Playtime with object arg)', () => {
    activeFilters['Playtime'] = { min: 20, max: 50 };
    const { rerender } = render(<FilterTags
      resetOption={() => {}}
      filterOrder={filterOrder}
      activeFilters={activeFilters}
    />);
    assertValidTagDisplayAndOrder(1, ['Playtime: 20 hour(s) to 50 hour(s)']);

    activeFilters['Playtime'] = { min: 50, max: 100 };
    rerender(<FilterTags
      resetOption={() => {}}
      filterOrder={filterOrder}
      activeFilters={activeFilters}
    />);
    assertValidTagDisplayAndOrder(1, ['Playtime: Over 50 hour(s)']);

    activeFilters['Playtime'] = { min: 100, max: 100 };
    rerender(<FilterTags
      resetOption={() => {}}
      filterOrder={filterOrder}
      activeFilters={activeFilters}
    />);
    assertValidTagDisplayAndOrder(1, ['Playtime: 100 hour(s) to No maximum']);
  });

  test('tags fire a handler on click that resets filter for that title to the default', () => {
    activeFilters['Playtime'] = 'Over 10 hour(s)';
    const resetMock = jest.fn();

    render(<FilterTags
      resetOption={resetMock}
      filterOrder={filterOrder}
      activeFilters={activeFilters}
    />);

    fireEvent.click(screen.getByText('Playtime: Over 10 hour(s)'));
    expect(resetMock).toHaveBeenCalledTimes(1);
    expect(resetMock).toHaveBeenCalledWith('Playtime');
  });
});
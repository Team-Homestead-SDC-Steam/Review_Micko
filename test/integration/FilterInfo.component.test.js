import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FilterInfo from '../../client/src/FilterInfo/FilterInfo';

jest.mock('../../client/src/FilterInfo/FilterTags', () => {
  // eslint-disable-next-line react/display-name
  return () => <div></div>;
});

describe('<FilterInfo /> tests', () => {
  test('renders with the correct display', () => {
    const { rerender } = render(<FilterInfo
      resetOption={() => {}}
      filterOrder={[]}
      activeFilters={{}}
      gameSentiment={'Mostly Positive'}
      reviewCount={6}
    />);

    // These tests are separate due to being in separate DOM nodes
    expect(screen.getByText('Showing', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('reviews that match the filters above', { exact: false })).toBeInTheDocument();

    // Positive sentiment
    let sentiment = screen.getByText('Mostly Positive');
    expect(sentiment).toBeInTheDocument();

    // Mixed sentiment
    rerender(<FilterInfo
      resetOption={() => { }}
      filterOrder={[]}
      activeFilters={{}}
      gameSentiment={'Mixed'}
      reviewCount={6}
    />);
    sentiment = screen.getByText('Mixed');
    expect(sentiment).toBeInTheDocument();

    // Negative sentiment
    rerender(<FilterInfo
      resetOption={() => { }}
      filterOrder={[]}
      activeFilters={{}}
      gameSentiment={'Overwhelmingly Negative'}
      reviewCount={6}
    />);
    sentiment = screen.getByText('Overwhelmingly Negative');
    expect(sentiment).toBeInTheDocument();
  });
});

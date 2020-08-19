import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainReviews from '../../client/src/Reviews/MainReviews';
import { summaryQueryRes } from '../fixtures/sampleData';

describe('<MainReviews />, <MainReview />, and <User /> interaction tests', () => {
  test('renders correctly with valid passed props', () => {
    render(<MainReviews reviews={summaryQueryRes.data} />);

    expect(screen.getAllByTestId('main-review').length).toBe(summaryQueryRes.data.length);
    // Will only be testing that these two crucial parts of the review are
    // present, since further testing of other parts (i.e. num_found_helpful and other
    // review data), is being verified in component unit tests
    summaryQueryRes.data.forEach(datum => {
      expect(screen.getByText(datum.user.username)).toBeInTheDocument();
      expect(screen.getByText(datum.review_text)).toBeInTheDocument();
    });
  });

  test('renders with default props when no props passed', () => {
    // Suppress prop-types' console.error warnings
    console.error = jest.fn();
    render(<MainReviews />);

    // One rendered review
    expect(screen.getAllByTestId('main-review').length).toBe(1);
    // Review text
    expect(screen.getByText('No review available.')).toBeInTheDocument();
    // Username
    expect(screen.getByText('Error404Boi')).toBeInTheDocument();
    // User profile image URL for image not found
    expect(screen.getByAltText('User Profile Image')).toHaveAttribute(
      'src',
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg'
    );
  });

  test('child component <MainReview /> renders correctly when passed invalid props', () => {
    render(<MainReviews reviews={[undefined]}/>);

    // One rendered review
    expect(screen.getAllByTestId('main-review').length).toBe(1);
    // Review text
    expect(screen.getByText('No review available.')).toBeInTheDocument();
    // Username
    expect(screen.getByText('Error404Boi')).toBeInTheDocument();
    // Posted date
    expect(screen.getByText('Posted: 1 January')).toBeInTheDocument();
    // Review ratings
    expect(screen.getByText('420 people found this review helpful')).toBeInTheDocument();
    expect(screen.getByText('421 people found this review funny')).toBeInTheDocument();
  });
});

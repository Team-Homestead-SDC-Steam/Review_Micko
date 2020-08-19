import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainReviewBody from '../../client/src/Reviews/MainReviewBody';

describe('<MainReviewBody /> tests', () => {
  // Assertion function for reuse
  const assertValidBodyContent = (dateDisplay, review, receivedFree) => {
    expect(screen.getByText(`Posted: ${dateDisplay}`)).toBeInTheDocument();

    if (receivedFree) {
      expect(screen.getByText('Product received for free')).toBeInTheDocument();
    } else {
      expect(screen.queryByText('Product received for free')).toBeNull();
    }

    expect(screen.getByText(review)).toBeInTheDocument();
  };

  test('renders correctly with all variations of valid props', () => {
    const { rerender } = render(
      <MainReviewBody
        datePosted='2020-06-06T00:00:00.000Z'
        review='Test review'
        receivedFree={false}
      />
    );
    assertValidBodyContent('6 June', 'Test review', false);

    rerender(
      <MainReviewBody
        datePosted='2019-06-06T00:00:00.000Z'
        review='Test review 2'
        receivedFree={false}
      />
    );
    assertValidBodyContent('6 June, 2019', 'Test review 2', false);

    rerender(
      <MainReviewBody
        datePosted='2019-09-06T00:00:00.000Z'
        review='Test review 3'
        receivedFree={true}
      />
    );
    assertValidBodyContent('6 September, 2019', 'Test review 3', true);
  });

  test('renders with default props when passed no props', () => {
    // Suppress prop-types console warnings
    console.error = jest.fn();
    render(<MainReviewBody />);
    assertValidBodyContent('1 January', 'No review available.', false);
  });
});

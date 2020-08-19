import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainReviewFooter from '../../client/src/Reviews/MainReviewFooter';

describe('<MainReviewFooter /> tests', () => {
  // Assertion function for reuse
  const assertValidFooterContent = (helpfulCount, funnyCount, commentCount) => {
    let helpfulMsg = `${helpfulCount} ${helpfulCount > 1 ? 'people' : 'person'} found this review helpful`;
    let funnyMsg = `${funnyCount} ${funnyCount > 1 ? 'people' : 'person'} found this review funny`;

    expect(screen.getByText('Was this review helpful?')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('😂 Funny')).toBeInTheDocument();
    expect(screen.getByText('🏆 Award')).toBeInTheDocument();
    if (helpfulCount > 0) {
      expect(screen.getByText(helpfulMsg)).toBeInTheDocument();
    } else {
      expect(screen.queryByText(helpfulMsg)).toBeNull();
    }

    if (funnyCount > 0) {
      expect(screen.getByText(funnyMsg)).toBeInTheDocument();
    } else {
      expect(screen.queryByText(funnyMsg)).toBeNull();
    }

    if (commentCount > 0) {
      let commentCountDisplay = screen.getByText(String(commentCount));
      expect(commentCountDisplay).toBeInTheDocument();

      fireEvent.mouseEnter(commentCountDisplay);
      let tooltipNode = screen.getByText('See Full Review');
      expect(tooltipNode).toBeInTheDocument();
    } else {
      expect(screen.queryByTestId('comment-count')).toBeNull();
    }
  };

  // Tests
  test('renders correctly with valid passed props and singular review ratings (numFound={1})', () => {
    render(
      <MainReviewFooter
        numFoundHelpful={1}
        numFoundFunny={1}
        numComments={345}
      />
    );
    assertValidFooterContent(1, 1, 345);
  });

  test('renders message correctly with plural review ratings (numFound={>1})', () => {
    render(
      <MainReviewFooter
        numFoundHelpful={5}
        numFoundFunny={6}
        numComments={678}
      />
    );
    assertValidFooterContent(5, 6, 678);
  });

  test('does not render relevant sub-component when passed 0 for related prop', () => {
    const { rerender } = render(
      <MainReviewFooter
        numFoundHelpful={7}
        numFoundFunny={8}
        numComments={0}
      />
    );
    assertValidFooterContent(7, 8, 0);

    rerender(
      <MainReviewFooter
        numFoundHelpful={0}
        numFoundFunny={8}
        numComments={5}
      />
    );
    assertValidFooterContent(0, 8, 5);

    rerender(
      <MainReviewFooter
        numFoundHelpful={9}
        numFoundFunny={0}
        numComments={4}
      />
    );
    assertValidFooterContent(9, 0, 4);
  });

  test('renders with default props when not passed props', () => {
    // Suppress prop-types console warnings
    console.error = jest.fn();
    render(
      <MainReviewFooter />
    );
    assertValidFooterContent(0, 0, 0);
  });
});

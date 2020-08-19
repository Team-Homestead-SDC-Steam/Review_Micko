import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainReviewHeader from '../../client/src/Reviews/MainReviewHeader';

describe('<MainReviewHeader /> tests', () => {
  const recommendedIcon = 'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_thumbsUp_v6.png';
  const notRecommendedIcon = 'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_thumbsDown_v6.png';
  const steamPurchaseIcon = 'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_review_steam.png';
  const otherPurchaseIcon = 'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_review_key.png';
  const steamPurchaseMsg = 'Product purchased directly from Steam';
  const otherPurchaseMsg = 'Product activated via Steam key';

  // Assertion function for reuse
  const assertValidHeaderContent = (isRecommended, hrsOnRecord, hrsReviewTime, purchaseType) => {
    let hoursMsg = `${hrsOnRecord} hrs on record (${hrsReviewTime} hrs at review time)`;

    expect(screen.getByAltText('Recommended Icon')).toHaveAttribute(
      'src',
      isRecommended ? recommendedIcon : notRecommendedIcon
    );
    expect(screen.getByText(isRecommended ? 'Recommended' : 'Not Recommended')).toBeInTheDocument();
    expect(screen.getByText(hoursMsg)).toBeInTheDocument();

    let purchaseTypeIcon = screen.getByAltText('Game Purchase Type');
    expect(purchaseTypeIcon).toBeInTheDocument();
    expect(purchaseTypeIcon).toHaveAttribute(
      'src',
      purchaseType === 'direct' ? steamPurchaseIcon : otherPurchaseIcon
    );

    // Tooltip
    fireEvent.mouseEnter(purchaseTypeIcon);
    let tooltipNode = screen.getByText(purchaseType === 'direct' ? steamPurchaseMsg : otherPurchaseMsg);
    expect(tooltipNode).toBeInTheDocument();
  };

  // Tests
  test('renders correctly with all valid variations of passed props', () => {
    const { rerender } = render(
      <MainReviewHeader
        isRecommended={true}
        hrsOnRecord='88.8'
        hrsReviewTime='99.9'
        purchaseType='direct'
      />
    );
    assertValidHeaderContent(true, '88.8', '99.9', 'direct');

    rerender(
      <MainReviewHeader
        isRecommended={false}
        hrsOnRecord='88.8'
        hrsReviewTime='99.9'
        purchaseType='direct'
      />
    );
    assertValidHeaderContent(false, '88.8', '99.9', 'direct');

    rerender(
      <MainReviewHeader
        isRecommended={true}
        hrsOnRecord='88.8'
        hrsReviewTime='99.9'
        purchaseType='key'
      />
    );
    assertValidHeaderContent(true, '88.8', '99.9', 'key');

    rerender(
      <MainReviewHeader
        isRecommended={false}
        hrsOnRecord='88.8'
        hrsReviewTime='99.9'
        purchaseType='key'
      />
    );
    assertValidHeaderContent(false, '88.8', '99.9', 'key');
  });

  test('renders with default props when passed no props', () => {
    // Suppress prop-types console warnings
    console.error = jest.fn();
    render(<MainReviewHeader />);
    assertValidHeaderContent(true, '0.0', '0.0', 'direct');
  });
});

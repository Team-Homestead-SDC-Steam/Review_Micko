import React from 'react';
import PropTypes from 'prop-types';
import InfoTooltip from '../FilterMenu/InfoTooltip';
import { FlexDiv } from '../UIUXUtils';
import {
  RecentHeaderCtn,
  RecentRecommendedThumb,
  RecentUsername,
  RecentHours,
  RecentPurchaseType
} from './Reviews.styles';

const RecentReviewHeader = ({ isRecommended, purchaseType, username, hoursReviewTime }) => {
  return (
    <RecentHeaderCtn flexDirection='row' justifyContent='space-between'>
      <FlexDiv flexDirection='row'>
        {
          isRecommended ?
            <RecentRecommendedThumb src='https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_thumbsUp_v6.png' /> :
            <RecentRecommendedThumb src='https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_thumbsDown_v6.png' />
        }
        <RecentUsername>{username}</RecentUsername>
        <RecentHours>{hoursReviewTime} hrs</RecentHours>
      </FlexDiv>
      <InfoTooltip
        message={purchaseType === 'direct' ? 'Product purchased directly from Steam' : 'Product activated via Steam key'}
        xOff={-30}
        yOff={30}
        width='fit-content'
        wrap='false'
      >
        <RecentPurchaseType src={purchaseType === 'direct' ?
            'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_review_steam.png' :
            'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_review_key.png'
          }
          alt='Game Purchase Type - Side Menu'
        />
      </InfoTooltip>
    </RecentHeaderCtn>
  );
}

RecentReviewHeader.propTypes = {
  isRecommended: PropTypes.bool.isRequired,
  purchaseType: PropTypes.oneOf(['direct', 'key']).isRequired,
  username: PropTypes.string.isRequired,
  hoursReviewTime: PropTypes.string.isRequired
};

export default RecentReviewHeader;

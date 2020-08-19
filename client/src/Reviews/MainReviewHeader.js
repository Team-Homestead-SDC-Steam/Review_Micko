import React from 'react';
import PropTypes from 'prop-types';
import InfoTooltip from '../FilterMenu/InfoTooltip';
import { FlexDiv } from '../UIUXUtils';
import { ReviewHeader, ThumbIcon, ReviewRecommendation, UserGameHours, PurchaseTypeIcon } from './Reviews.styles';

const MainReviewHeader = ({ isRecommended = true, hrsOnRecord = '0.0', hrsReviewTime = '0.0', purchaseType = 'direct' }) => {
  return (
    <ReviewHeader justifyContent='space-between' alignItems='flex-start'>
      <FlexDiv flexDirection='row'>
        <ThumbIcon
          alt="Recommended Icon"
          src={isRecommended ?
            'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_thumbsUp_v6.png' :
            'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_thumbsDown_v6.png'
          }
        />
        <div>
          <ReviewRecommendation>{isRecommended ? 'Recommended' : 'Not Recommended'}</ReviewRecommendation>
          <UserGameHours>{hrsOnRecord} hrs on record ({hrsReviewTime} hrs at review time)</UserGameHours>
        </div>
      </FlexDiv>
      <InfoTooltip
        message={purchaseType === 'direct' ? 'Product purchased directly from Steam' : 'Product activated via Steam key'}
        xOff={45}
        yOff={-2}
        width='fit-content'
        wrap='false'
      >
        <PurchaseTypeIcon
          src={purchaseType === 'direct' ?
            'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_review_steam.png' :
            'https://steamstore-a.akamaihd.net/public/shared/images/userreviews/icon_review_key.png'
          }
          alt='Game Purchase Type'
        />
      </InfoTooltip>
    </ReviewHeader>
  );
};

MainReviewHeader.propTypes = {
  isRecommended: PropTypes.bool.isRequired,
  hrsOnRecord: (props, propName, componentName) => {
    if (!/^\d{1,4}\.\d$/.test(props[propName])) {
      return new Error(`Invalid prop '${propName}' ('${props[propName]}') supplied to '${componentName}', expected a single precision float string.`);
    }
  },
  hrsReviewTime: (props, propName, componentName) => {
    if (!/^\d{1,4}\.\d$/.test(props[propName])) {
      return new Error(`Invalid prop '${propName}' ('${props[propName]}') supplied to '${componentName}', expected a single precision float string.`);
    }
  },
  purchaseType: PropTypes.oneOf(['direct', 'key'])
};

export default MainReviewHeader;

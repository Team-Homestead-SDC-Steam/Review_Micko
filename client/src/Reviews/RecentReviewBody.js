import React from 'react';
import PropTypes from 'prop-types';
import { getHumanReadableFromISO } from '../../utils';
import { RecentBodyCtn, PostedDate, ReceivedFree, RecentReviewTextCtn } from './Reviews.styles';

const RecentReviewBody = ({ datePosted = '2020-01-01T00:00:00.000Z', review = 'No review available.', receivedFree = false }) => {
  let dateDisplay = getHumanReadableFromISO(datePosted);
  // If date is in current year, remove year portion of display
  // Date .getYear method from MDN: "A number representing the year of the given date, according to local time, minus 1900."
  if (datePosted.slice(0, 4) === String(new Date(Date.now()).getYear() + 1900)) {
    dateDisplay = dateDisplay.slice(0, dateDisplay.length - 6);
  }
  return (
    <RecentBodyCtn>
      <PostedDate>Posted: {dateDisplay}</PostedDate>
      {
        receivedFree ?
          <ReceivedFree style={{ marginTop: '5px' }}>Product received for free</ReceivedFree> :
          ''
      }
      <RecentReviewTextCtn>{review}</RecentReviewTextCtn>
    </RecentBodyCtn>
  );
};

RecentReviewBody.propTypes = {
  datePosted: (props, propName, componentName) => {
    if (!/^20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(props[propName])) {
      return new Error(`Invalid prop '${propName}' ('${props[propName]}') supplied to '${componentName}', expected an ISO Date string.`);
    }
  },
  review: PropTypes.string.isRequired,
  receivedFree: PropTypes.bool.isRequired
};

export default RecentReviewBody;

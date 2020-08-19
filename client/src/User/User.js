import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { addCommaToCount } from '../../utils';

const UserContainer = styled.div`
  #${props => props.theme.rootId} & {
    width: 184px;
    padding: 8px;
    opacity: 0.6;
    display: flex;
    flex-direction: row;
    cursor: pointer;
    :hover {
      opacity: 1;
    }
  }
`;

const ImageContainer = styled.div`
  #${props => props.theme.rootId} & {
    width: 34px;
    height: 34px;
    position: relative;
    padding: 1px;
    filter: none;
    background-color: ${props => props.colorTheme[props.status].plainColor};
    background: -webkit-linear-gradient(${props => props.colorTheme[props.status].webkit});
    background: linear-gradient(${props => props.colorTheme[props.status].default});
    margin-right: 6px;
  }
`;

ImageContainer.propTypes = {
  status: PropTypes.oneOf(['offline', 'online', 'inGame']).isRequired
};

ImageContainer.defaultProps = {
  status: 'offline',
  colorTheme: {
    offline: {
      webkit: 'top, rgba(106,106,106,1) 5%, rgba(85,85,85,1) 95%',
      default: 'to bottom, rgba(106,106,106,1) 5%, rgba(85,85,85,1) 95%',
      plainColor: 'rgba(0, 0, 0, 0)'
    },
    online: {
      webkit: 'top, rgba(83,164,196,1) 5%, rgba(69,128,151,1) 95%',
      default: 'to bottom, rgba(83,164,196,1) 5%, rgba(69,128,151,1) 95%',
      plainColor: '#57cbde'
    },
    inGame: {
      webkit: 'top, rgba(143,185,59,1) 5%, rgba(110,140,49,1) 95%',
      default: 'to bottom, rgba(143,185,59,1) 5%, rgba(110,140,49,1) 95%',
      plainColor: '#90ba3c'
    },
  }
};

const ProfileImg = styled.img`
  #${props => props.theme.rootId} & {
    width: 32px;
    height: 32px;
    background: -webkit-linear-gradient(${props => props.colorTheme[props.status].webkit});
    background: linear-gradient(${props => props.colorTheme[props.status].default});
    padding: 1px;
    border: none;
  }
`;

ProfileImg.propTypes = {
  status: PropTypes.oneOf(['offline', 'online', 'inGame']).isRequired
};

ProfileImg.defaultProps = {
  status: 'offline',
  colorTheme: {
    offline: {
      webkit: 'top, #515151 5%, #474747 95%',
      default: 'to bottom, #515151 5%, #474747 95%'
    },
    online: {
      webkit: 'top, #41778f 5%, #3d697b 95%',
      default: 'to bottom, #41778f 5%, #3d697b 95%'
    },
    inGame: {
      webkit: 'top, #66812e 5%, #59702b 95%',
      default: 'to bottom, #66812e 5%, #59702b 95%'
    },
  }
};

const Username = styled.p`
  #${props => props.theme.rootId} & {
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 140px;
    overflow: hidden;
    margin-top: -2px;
    margin-bottom: -1px;
    display: inline-block;
    font-family: 'Roboto', sans-serif;
    color: #c1dbf4;
    font-size: 13px;
    font-weight: bold;
  }
`;

const NumStats = styled.p`
  #${props => props.theme.rootId} & {
    display: block;
    :hover {
      color: #67c1f5;
    }
  }
`;

const defaultUser = {
  username: 'Error404Boi',
  // If url doesn't exist, provide 'not found' profile image
  profile_url: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
  is_online: false,
  num_products: 0,
  num_reviews: 0,
  steam_level: 1,
  is_in_game: false,
  in_game_status: null
};

/**
 * A default prop is specified above so that default reviews are not recreated with every
 * function call, causing child components to rerender every time a parent rerenders, even if child
 * components have not changed.
 */
const User = ({ info = defaultUser }) => {
  let userStatus;
  if (info.is_in_game) {
    userStatus = 'inGame';
  } else {
    userStatus = info.is_online ? 'online' : 'offline';
  }
  return (
    <UserContainer>
      <ImageContainer
        status={userStatus}
        data-testid="image-container"
      >
        <ProfileImg
          src={info.profile_url}
          status={userStatus}
          alt="User Profile Image"
        />
      </ImageContainer>
      <div>
        <Username>{info.username}</Username>
        <NumStats>{addCommaToCount(info.num_products)} products in account</NumStats>
        <NumStats>{addCommaToCount(info.num_reviews)} reviews</NumStats>
      </div>
    </UserContainer>
  );
};

User.propTypes = {
  info: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile_url: (props, propName, componentName) => {
      if (!/^https?:\/\/.*\.(?:jpg|png)$/.test(props[propName])) {
        return new Error(`Invalid prop '${propName}' ('${props[propName]}') supplied to '${componentName}', expected a profile image URL.`);
      }
    },
    is_online: PropTypes.bool.isRequired,
    num_products: PropTypes.number.isRequired,
    num_reviews: PropTypes.number.isRequired,
    steam_level: PropTypes.number.isRequired,
    is_in_game: PropTypes.bool.isRequired,
    in_game_status: PropTypes.string,
    badge: PropTypes.object // Further validated in Badge.js if exists
  })
};

User.defaultProps = {
  info: {
    username: 'Error404Boi',
    // If url doesn't exist, provide 'not found' profile image
    profile_url: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg',
    is_online: false,
    num_products: 0,
    num_reviews: 0,
    steam_level: 1,
    is_in_game: false,
    in_game_status: null
  }
};

export default User;

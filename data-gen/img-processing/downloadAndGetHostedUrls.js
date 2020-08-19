/* eslint-disable camelcase */
// THIS SCRIPT DOESN'T NEED TO BE USED AGAIN. After initial picture download,
// URLs to cloud hosted photos are located in ./hostedUrls.json.
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const cloudinary = require('cloudinary').v2;
const badgeWikiUrls = require('./badgeWikiUrls.json');
const { getRandomHexColor, getRandIdx } = require('../utils');

/**
 * Downloads the 16 badge images corresponding to their titles from the steam wiki
 */
const downloadBadgeImgs = async () => {
  console.log('Downloading 16 badge imgs to ./imgs directory, please wait...');

  // Map urls to fetch promises that resolve to true or reject to false
  let downloadPromises = badgeWikiUrls.map(({ title, url }) => {
    return fetch(url)
      .then(res => res.body)
      .then(readable => {
        let writePath = path.resolve(__dirname, 'imgs', `${title.toLowerCase().split(' ').join('-')}.png`);
        let writeable = fs.createWriteStream(writePath);
        readable.on('end', () => {
          writeable.end();
        });
        readable.pipe(writeable);
        return true;
      })
      .catch(err => {
        console.error(err);
        return false;
      });
  });

  // For now, return await is unnecessary, but if this fn is being in anything
  // other than a CLI one-time-use script, then a return might be expected & will save time.
  return await Promise.all(downloadPromises);
};

/**
 * Downloads numToDownload unique avatar images to the file system (path ./imgs)
 * @param {Integer} numToDownload
 */
const downloadProfileImgs = async (numToDownload = 100) => {
  console.log(`Downloading ${numToDownload} randomly generated user avatars to ./img...`);
  if (numToDownload > 100) {
    throw new Error('Please limit number of images to 100 at a time or less to respect rate limits.');
  }

  let eyesOptions = [ 1, 2, 3, 4, 5, 6, 7, 9, 10 ];
  let noseOptions = [ 2, 3, 4, 5, 6, 7, 8, 9 ];
  let mouthOptions = [ 1, 3, 5, 6, 7, 9, 10, 11 ];
  let eLen = eyesOptions.length;
  let nLen = noseOptions.length;
  let mLen = mouthOptions.length;
  let basePath = 'https://api.adorable.io/avatars/face/';

  // Map urls to fetch promises that resolve to true or reject to false

  let downloadPromises = new Array(numToDownload).fill(0).map((_, idx) => {
    let hexColor = getRandomHexColor();
    let url = basePath
      + `eyes${eyesOptions[getRandIdx(eLen)]}/`
      + `nose${noseOptions[getRandIdx(nLen)]}/`
      + `mouth${mouthOptions[getRandIdx(mLen)]}/`
      + hexColor;

    return fetch(url)
      .then(res => res.body)
      .then(readable => {
        let writePath = path.resolve(__dirname, 'imgs', `${hexColor}${idx.toString().padStart(3, '0')}.png`);
        let writeable = fs.createWriteStream(writePath);
        readable.on('end', () => {
          writeable.end();
        });
        readable.pipe(writeable);
        return true;
      })
      .catch(err => {
        console.error(err);
        return false;
      });
  });

  // For now, return await is unnecessary, but if this fn is being in anything
  // other than a CLI one-time-use script, then a return might be expected & will save time.
  return await Promise.all(downloadPromises);
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

/**
 * Promisifies cloudinary's resources_by_tag function
 * @returns {Promise}
 */
const getResourcesByTag = (tag, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.resources_by_tag(tag, options, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
};

/**
 * Gets of list of URLs of resources uploaded to Cloudinary
 */
const getHostedUrls = async () => {
  let badgeUrls;
  let avatarUrls = [];

  // Get 16 badge URLs
  try {
    let results = await getResourcesByTag('badge', { max_results: 16 });
    if (results.resources.length) {
      badgeUrls = results.resources.map(resource => resource.secure_url);
    }
  } catch (e) {
    console.error(e);
    return;
  }

  // Get 750 user profile (avatar) URLs - last for loop retrieves last 50 URLs
  // (Since there are only 750 URLs stored in this server)

  // nextCursor / next_cursor is part of Cloudinary's API response, which allows for pagination on large requests
  // As each request is limited to 100 resources in its response
  let nextCursor;
  for (let i = 0; i < 8; i++) {
    let options = {
      max_results: 100
    };

    if (nextCursor) {
      options.next_cursor = nextCursor;
    }

    try {
      let hundredResults = await getResourcesByTag('avatar', options);
      if (hundredResults.resources.length) {
        avatarUrls = [...avatarUrls, ...hundredResults.resources.map(resource => resource.secure_url)];
      }
      nextCursor = hundredResults.next_cursor ? hundredResults.next_cursor : false;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  let jsonObj = {
    badges: badgeUrls,
    profiles: avatarUrls
  };

  let writeStream = fs.createWriteStream(path.resolve(__dirname, '..', '..', 'server', 'db', 'hostedUrls.json'));
  writeStream.end(JSON.stringify(jsonObj));
  console.log('Hosted urls acquired. Check server/db/hostedUrls.json.');
};

getHostedUrls();
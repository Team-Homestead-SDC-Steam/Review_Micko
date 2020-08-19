const fs = require('fs');

/**
 * Formats the input object into a writeable line of csv
 * @param {Object} obj
 * @param {Array} keys: indicates order of format
 * @returns {String}
 */
const convertObjToCsv = (obj, keys) => {
  let copied = { ...obj };
  let csvStr = '';
  keys.forEach((key, idx) => {
    if (typeof copied[key] === 'string' && copied[key].indexOf(',') !== -1) {
      copied[key] = `"${copied[key]}"`;
    }
    csvStr += `${copied[key]}${idx === keys.length - 1 ? '\r\n' : ','}`;
  });
  return csvStr;
};

/**
 * Writes an array of generated data to .csv file into input directory.
 * @param {Array} arr: array of object data
 * @param {Array} order: write order to follow when writing contents of array
 * @param {String} writePath: directory to write file to
 * @returns {Promise}
 */
exports.writeToCsv = (arr, order, writePath) => {
  // .csv file will be piped into
  // database through .sql seed file (COPY FROM...)
  return new Promise((resolve, reject) => {
    let stream = fs.createWriteStream(writePath);
    stream.on('error', (err) => {
      reject(err);
    });
    stream.on('close', () => {
      console.log('\tFile written to', writePath);
      resolve(true);
    });

    stream.write(order.join(',') + '\r\n');
    stream.end(arr.map(userObj => convertObjToCsv(userObj, order)).join(''));
  });
};

/**
 * Generates a single part of a three-part hex color
 * @returns {String}
 */
const generateHexUnit = () => {
  return Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
};

/**
 * Generates a random hexadecimal color between #000000 and #ffffff
 * @returns {String}: hex color with format nnnnnn (no need for hash)
 */
exports.getRandomHexColor = () => {
  let randR = generateHexUnit();
  let randG = generateHexUnit();
  let randB = generateHexUnit();

  return `${randR}${randG}${randB}`;
};

/**
 * Generates a random index between 0 and limit
 * @param {Integer} limit
 * @returns {Integer}
 */
exports.getRandIdx = (limit) => {
  return Math.floor(Math.random() * limit);
};

module.exports.convertObjToCsv = convertObjToCsv;
module.exports.generateHexUnit = generateHexUnit;
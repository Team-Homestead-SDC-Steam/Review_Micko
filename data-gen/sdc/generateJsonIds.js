const fs = require('fs');

let generateRandomNum = (min = 1, max, float, precision = 10) => {
  return float ? Math.floor((Math.random() * (max - min) + 1000)) / precision : Math.floor(Math.random() * (max - min + 1)) + min
}

const writeIds = fs.createWriteStream('ids.json');

let writeIdsFunc = (writer, encoding, callback) => {

  let write = () => {
    let dataObj = {
      "keys": ["gameid"],
      "values": []
    };
    let amount = 500;
    for (let i = 0; i < amount; i++) {
      let id_game = generateRandomNum(1, 10000000, false);
      dataObj["values"].push([`${id_game}`]);
    }
    let dataToWrite = JSON.stringify(dataObj)
    writer.write(dataToWrite, encoding, callback);
  }
  write();
}
writeIdsFunc(writeIds, 'utf-8', () => {
  writeIds.end();
});
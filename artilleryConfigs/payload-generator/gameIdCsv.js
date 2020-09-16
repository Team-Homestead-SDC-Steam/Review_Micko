const fs = require('fs');
const path = require('path')
const writeIdData = fs.createWriteStream('gameIds.csv', 'utf-8',path.resolve('/artilleryConfigs'));

writeIdData.write('gameId\n', 'utf-8');

let generateAndWriteRandomIds = (writer, amountOfIds) => {

  for (let i = 0; i < amountOfIds; i++) {
    let randomId = Math.floor((Math.random() * 30000) + 1);
    writer.write(randomId.toString() + '\n', 'utf-8');
  }

  writer.end();
}

//realistically a user would -probably- only look through 15 different types of games(?)
generateAndWriteRandomIds(writeIdData, 15);
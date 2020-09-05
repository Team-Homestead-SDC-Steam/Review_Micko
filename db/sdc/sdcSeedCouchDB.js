const nano = require('nano')('http://admin:test@127.0.0.1:5984');
//const documents = require('../../data-gen/sdc/reviews.json');

const initialSetUp = async () => {
  //delete database if already exists
  try {
    //await nano.db.destroy('steam-reviews');
    await nano.db.create('steam-reviews');

  } catch (e) {
    console.log("Something went wrong with deleting or creating database");
    console.error(e);
    console.log('destroying and creating database');
    await nano.db.destroy('steam-reviews');
    await nano.db.create('steam-reviews');
  }
}

const bulkOperation = (documents, database) => {

  database.bulk({docs: documents}).then((body) => {
    console.log(body);
  }).catch((e) => {
    console.log("Something went wrong in bulk operation");
    console.error(e);
  })

}

initialSetUp();
//bulkOperation(documents, nano.use('steam-reviews'));



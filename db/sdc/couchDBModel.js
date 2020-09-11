const nano = require('nano')('http://micko:test@127.0.0.1:5984');

//Assuming that the steam-reviews database has been created in CouchDB
const steamReviews = nano.use('steam-reviews');

let getById = async (id) => {
  let result = await steamReviews.get(id);
  console.log(result);
  return result;
}

let insertByDocument = async (doc) => {
  let result = await steamReviews.insert(doc);
  console.log(result);
  return result;
}

let updateById = async (id, options) => {
  let document = await steamReviews.get(id);
  let revId = document._rev;
  console.log(revId);
  let combinedDocument = {
    _id: id,
    _rev: revId,
    ...options
  };
  let result = await steamReviews.insert(combinedDocument);
  console.log(result);

  return result;
}

let deleteById = async (id) => {
  let document = await steamReviews.get(id);
  let revId = document._rev;
  let result = await steamReviews.destroy(id, revId);
  console.log(result);
  return result;
}

// let coreQueriesAndSamples = async () => {
//   let dataToInsert = { _id: 'Sally',
//   id_user: 1,
//   id_game: 1,
//   is_recommended: true,
//   hours_on_record: 1.5,
//   hours_at_review_time: 1.5,
//   purchase_type: 'direct',
//   date_posted: '2017-03-19T23:39:44.189Z',
//   received_free: true,
//   review_text:
//    'Im a cool kid in the block',
//   num_found_helpful: 74,
//   num_found_funny: 135,
//   num_comments: 90 }

//   try {
//     // console.log("Getting document by ID: ")
//     await getById('Sally');
//     //console.log("Inserting a new document")
//     //await insertByDocument(dataToInsert);
//     console.log("Updating an existing document")
//     await updateById('Sally', {
//       id_user: 123,
//       id_game: 99
//     });
//     console.log("Deleting a document")
//     await deleteById('Sally');
//   } catch (err) {
//     console.log(err);
//   }
// }

// coreQueriesAndSamples();
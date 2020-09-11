const knex = require('../knex.js')

let getReviewById = async (id) => {
  let result = await knex('reviews').where({id})
  console.log(result);
  return result;
}

let insertReview = async (data) => {
  //assuming that the data shape and keys are correct (will add checks later on)
  let insert = await knex('reviews').insert(data);
  console.log(insert);
  return insert;
}

let updateById = async (id, data) => {
  //assuming that data has correct matching keys
  let update = await knex('reviews').where({id}).update(data);
  console.log(update);
  return update;
}

let deleteById = async (id) => {
  let deleteById = await knex('reviews').where({id}).del();
  console.log(deleteById);
  return deleteById;
}

// let coreQueryAndSamples = async () => {
//   let dataToInsert = {
//     id_user: 1,
//     id_game: 1,
//     is_recommended: true,
//     hours_on_record: '1.3',
//     hours_at_review_time: '1.5',
//     purchase_type: 'direct',
//     date_posted: '2013-05-17T07:00:00.000Z',
//     received_free: true,
//     review_text:
//     'Ratione nostrum in qui qui non minus totam dolorum qui. Facilis dicta sit illo facilis excepturi in quis ea vel. Molestiae reprehenderit in. Non distinctio quos alias officia omnis.',
//     num_found_helpful: 2,
//     num_found_funny: 169,
//     num_comments: 60
//   }

//   try {
//     //insertReview(dataToInsert);
//     console.log('Querying..')
//     await getReviewById(10000001);
//     // console.log('Updating queried data...');
//     // await updateById(10000001, {review_text: 'I am updated to windows xp'});
//     // console.log('querying updated row...')
//     // await getReviewById(10000001);
//     console.log('Deleting...')
//     await deleteById(10000001);
//     console.log('attempting to query deleted row..');
//     await getReviewById(10000001); //returns an empty array
//   } catch (e) {
//     console.log(e);
//   }
// }

// coreQueryAndSamples();
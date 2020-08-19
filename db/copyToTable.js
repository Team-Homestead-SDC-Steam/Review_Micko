const { promisify } = require('util');
const stream = require('stream');
const copyFrom = require('pg-copy-streams').from;
const pipeline = promisify(stream.pipeline);

/**
 * Copies readableStream into Postgres tableName using txOrKnex connection pooling
 * @param {Object} txOrKnex
 * @param {String} tableName
 * @param {Array} cols: Explicitly list which columns to copy csv data into
 * @param {Stream} readableStream
 */
exports.copyToTable = async (txOrKnex, tableName, cols, readableStream) => {
  const knexClient = await (txOrKnex.trxClient || txOrKnex.client);
  const pgClient = await knexClient.acquireConnection();
  try {
    await pipeline(
      readableStream,
      pgClient.query(copyFrom(`COPY ${tableName} (${cols.join(',')}) FROM STDIN DELIMITER ',' CSV HEADER`))
    );
  } finally {
    await knexClient.releaseConnection(pgClient);
  }
};
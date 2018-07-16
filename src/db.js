/*
Top-level abstraction file for the database. This one is tuned to the pg-promise
library.  The purpose is to give a singular place in our code that all queries
go through for debugging/inspection reasons.  It does not cover the entirety of
pg-promise's API surface, but just the one's that have been needed so far.  Feel
free to add to it.
*/

const Bluebird = require('bluebird')
const pgPromise = require('pg-promise')

const pgp = pgPromise({ promiseLib: Bluebird })
const {
  QueryFile,
  errors: { QueryResultError }
} = pgPromise

function createDb ({ connectionString, dangerMode, tables }) {
  const client = pgp(connectionString)

  function close () {
    return client.$pool.end()
  }

  function any (...args) {
    return client.any(...args)
  }

  function one (...args) {
    return client.one(...args)
  }

  function tableExists (tableName) {
    return client
      .one(
        `select * from information_schema.tables where table_name = '${tableName}'`
      )
      .then(() => true)
      .catch(QueryResultError, () => false)
  }

  /**
   * @description Wait for it... drops a table.  Will not fail if the table
   * does not exist
   * @param {string} tableName The name of the table to drop
   */
  function dropTable (tableName) {
    return client.none(`DROP TABLE IF EXISTS ${tableName}`)
  }

  function runSqlFile (path) {
    const schemaFile = new QueryFile(path, { noWarnings: dangerMode })

    return client.none(schemaFile)
  }

  /**
   * @describes - Destroys and recreates the db. Testing likes clean
   *   environments.  Production does not.  This only gets enabled if
   *   the `allowWipe` setting is true.
   */
  function wipe () {
    return client.task('wipe', t =>
      Bluebird.each(tables, table => t.none(`DELETE from ${table}`))
    )
  }

  const retval = {
    any,
    close,
    one,
    runSqlFile,
    tableExists
  }

  // Some things aren't meant for non-test environments.
  if (dangerMode) {
    retval.dropTable = dropTable
    retval.wipe = wipe
  }

  return retval
}

module.exports = createDb

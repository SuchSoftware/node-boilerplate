// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('blue-tape')

const { app, config } = require('./')

test.onFinish(() => {
  config.eventStoreDb.client.destroy()
  config.readModelDb.client.destroy()
})

/* eslint-disable no-console */
process.on('unhandledRejection', err => {
  console.error('Uh-oh. Unhandled Rejection')
  console.error(err)

  process.exit(1)
})
/* eslint-enable no-console */

function reset() {}

module.exports = { app, config, reset }

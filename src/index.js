const createExpressApp = require('./app/express')
const createConfig = require('./config')
const env = require('./env')

const config = createConfig({ env })
const app = createExpressApp({ config, env })

function start() {
  config.eventStore.start().then(() => {
    app.listen(env.port, signalAppStart)
    config.aggregators.forEach(a => a.subscribeToStore(config.eventStore))
    config.services.forEach(s => s.subscribeToStore(config.eventStore))
  })
}

function signalAppStart() {
  /* eslint-disable no-console */
  console.log(`${env.appName} started`)
  console.table([['Port', env.port], ['Environment', env.env]])
  /* eslint-enable no-console */
}

module.exports = {
  app,
  config,
  start,
}

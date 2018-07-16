/*
The system makes heavy use of dependency injection.  This file wires up all the
dependencies, making use of the environment.
*/
const createHome = require('./app/home')

function createConfig({ env }) {
  // Configure the aggregators
  const aggregators = []

  // Configure the services
  const services = []

  // Configure application layer
  const home = createHome()

  return {
    aggregators,
    home,
    services,
  }
}

module.exports = createConfig

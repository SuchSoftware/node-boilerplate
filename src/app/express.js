/*
The application layer of the system uses [express](https://expressjs.com/) to
handle routing HTTP requests.  This file sets up the express application.
*/

const express = require('express')
const uuid = require('uuid/v4')

function primeRequestContext (req, res, next) {
  req.context = {
    correlationId: uuid()
  }

  next()
}

function attachLocals (req, res, next) {
  res.locals.context = req.context
  next()
}

function createExpressApp ({ config, env }) {
  const app = express()

  app.locals.appName = env.appName

  app.set('views', __dirname)
  app.set('view engine', 'pug')

  app.use(primeRequestContext)
  app.use(attachLocals)

  app.use('/', config.home.router)

  app.use((err, req, res, next) => {
    console.log(err)
  })

  return app
}

module.exports = createExpressApp

// MAYBE THE EVENT STORE PROVIDES ITS OWN DB ABSTRACTION AND THEN THE READ MODELS
// ALL USE KNEX. THAT ACTUALLY SOUNDS KIND OF PLEASANT.

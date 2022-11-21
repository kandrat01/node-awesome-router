const Reply = require('./../reply/index')
const subdomain = require('express-subdomain')
const FastestValidator = require('fastest-validator')
const express = require('express')

const Validator = new FastestValidator({
  useNewCustomCheckerFunction: true
})

const Router = {
  globalMiddleWares: [], 
  routes: [], 
  def404 (req, res) {
    return res.status(404).send('default 404');
  },
  async handle (app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    await this.setupMiddlewares(app)
    this.setupRoutes(app)
    app.get('*', (req, res) => {
      if(typeof this.on404 === 'function') {
         return this.on404(req, res)
      }
      return this.def404(req, res)
    })
  },
  async setupMiddlewares (app) {
    this.globalMiddleWares.map(async middleware => {
      app.use(middleware)
    })
  },
  setupRoutes (app) {
    this.routes.map(async route => {
      const key = route.key
      const routes = route.routes
      const expressRouter = express.Router()
      for (const itemRoute in routes) {
        const options = routes[itemRoute]()
        const middleWares = options.middleWares || []
        expressRouter[options.method](itemRoute, ...middleWares, (req, res) => {
          if (options.schema) {
            // need to validate
            try {
              const validated = this.validate(req.body, options.schema, req)
              if (validated !== true) {
                const reply = new Reply(400, (['Validation error: '].concat(validated.map(err => err.message))).join('\n'))
                return res.status(400).send(reply)
              }
            } catch (err) {
              console.log(err, req.body, options.schema)
              return res.status(500).send(new Reply(500, 'Could not validate req.body'))
            }
          }

          return options.handler(req, res)
        })
      }
      if (route.subdomain) {
        // this means we need some subdomain route
        app.use(key, subdomain(route.subdomain, expressRouter))
      } else {
        app.use(key, expressRouter)
      }
    })
  },
  validate (params, schema, req) {
    Validator._req = req
    return Validator.validate(params, schema, req)
  }
}

module.exports = ({app, routes, middleWares, on404}) => {
  Router.globalMiddleWares = middleWares || []
  Router.routes  = routes || []
  if(typeof on404 === 'function') {
    Router.on404 = on404
  }
  return Router.handle(app)
}
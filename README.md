<div align="center">
    <img width="360" src="logo.png" alt="Got">
</div>
<br/>

# Developer-Friendly router for Nodejs servers
## install
```bash
npm i -S node-awesome-router
```
## Usage
### Creating server
```js
const http = require('http')
const app = require('express')()
const NodeAwesomeRouter = require('node-awesome-router')

```
### Creating route
```js
// POST -> DEV.site.com/myPath/authorize
const routesGroup1 = {
  key: '/myPath',
  routes: {
    '/authorize' () {
      return {
        method: 'post',
        schema: {
          username: { type: 'string', min: 4, max: 15 },
          password: { type: 'string', min: 4, max: 20 },
        },
        middleWares: [
          (req, res, next) => { console.log('log1'); next();}, 
          (req, res, next) => { console.log('log2'); next();},
        ],
        async handler (req, res) {
          // your logic here
          return res.status(200).send('welcome')
        }   
      }
    }
  }, 
  subdomain: 'dev' 
}
```
### Another route
```js
// GET ->  USERS.site.com/user/info/1
const routesGroup2 = {
  key: '/user', 
  routes: {
    '/info/:id?' () {
        return {
          method: 'get',
          middleWares: [
          (req, res, next) => { console.log('auth attempt'); next()}, 
          ],
          async handler (req, res) {
            // your logic here
            return res.status(200).send('welcome')
          }   
        }
      }
  }, 
  subdomain: 'users' 
}

```

### Global middlewares
```js
const globalMiddleWare = (req, res, next) => {
  console.log('another request to our beauty backend')
}
```
### Setup router and start listen
```js

const httpServer = http.createServer(app)

NodeAwesomeRouter({
  app,
  routes: [routesGroup1, routesGroup2, ],
  middleWares: [globalMiddleWare, ],
  on404 (req, res) {
    return res.send('...')
  }
  
  
})

httpServer.listen(8080, () => {
  console.log('listening port 8080')
})

```
<hr/>

| Syntax | Description |
| --- | ----------- |
| app | [ExpressJS](https://expressjs.com/) instance |
| routes | array of routes |
| middleWares | array of middleware functions |
| on404 | 404 not found handler function |


## Details for validation schema syntax can be found here 
[fastest-validator](https://www.npmjs.com/package/fastest-validator)

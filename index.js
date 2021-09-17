const router = require('./src/router/index')
module.exports = ({app, routes, middleWares})  => {
    if(app.name !== 'app') {
        throw new Error(`The app argument must be instance of express, ${app.name} passed`)
    }
    if(routes) {
        if(!Array.isArray(routes)) {
            throw new Error('The router argumment must be array of routes')
        }
    } 
    if(middleWares) {
        if(!Array.isArray(middleWares)) {
            throw new Error('The router argumment must be array of routes')
        }
    } 
    return router({app, routes, middleWares})
}
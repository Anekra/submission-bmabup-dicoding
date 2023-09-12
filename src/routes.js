const handler = require('./handler')

const routes = Object.keys(handler).map((key) => ({
  method: handler[key].method,
  path: handler[key].path,
  handler: handler[key].handler
}))

module.exports = routes

const path = require('path')
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()
const port = 3003

server.use(middlewares)
server.use(router)
server.listen(port, () => {
  console.log('LCP Map - JSON Server is running at url: http://localhost:'+port+'/')
})
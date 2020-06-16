var PORT = process.env.PORT || 5544
var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var Logger = require('./logger')
var jc = require('json-cycle')
var app = express()
var DBLogger = require('./db/data')
var SocketIO = require('socket.io')
var server = require('http').Server(app)
var cors = require('cors')
var helmet = require('helmet')
var io = SocketIO(server)
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json({ type: 'application/*+json' }))
app.disable('x-powered-by')
//app.use(cors())

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.setHeader('X-Content-Type-Options', 'no-sniff')
  res.setHeader('X-XSS-Protection', 1)
  res.setHeader('X-Frame-Options', 'Deny')
  res.setHeader('X-Application-Category', 'WebHookListener')
  next();
}
app.use(allowCrossDomain)
//app.use(express.static(path.resolve('./public/')))
app.all('/', (req, res) => {
  var summary =JSON.stringify({
    params: req.params,
    method: req.method,
    query: req.query,
    body: req.body,
    headers: req.headers
  })
  console.log("Server keys: ",Object.keys(app))
  let dbLog={request: jc.stringify(req), body: jc.stringify(req.body), query: jc.stringify(req.query), summary: summary } 
  DBLogger.saveReport(dbLog).then(d => console.log(d)).catch(e => console.log(e))
  console.log(req.headers)
  console.log("Headers: ", JSON.stringify(req.headers))
  io.origins('*:*')
  io.sockets.emit('data',JSON.parse(summary))
  console.log(`\n-------------------TIME : ${(new Date()).toISOString().slice(0,19)}-------------------------------------\n`)
  console.log(JSON.parse(summary))
  Logger.debug(summary)
  
  res.status(200).json({ message: 'Received'})
})

app.get('/notifications/:entity', async (req, res) => {
  let entity = req.params.entity
  res.status(200).json({
    entity: entity
  })
  console.log(entity)
})
app.all('/webhook/:entity', (req, res) => {
  var status =JSON.stringify({
    params: req.params,
    method: req.method,
    query: req.query,
    body: req.body,
    headers: req.headers
  })
  console.log(req.headers)
  console.log("Headers: ", JSON.stringify(req.headers))
  io.origins('*:*')
  io.sockets.emit('data',JSON.parse(status))
  console.log(`\n-------------------TIME : ${(new Date()).toISOString().slice(0,19)}-------------------------------------\n`)
  console.log(JSON.parse(status))
  Logger.debug(status)
  res.status(200).json({ message: 'Received'})
})
server.listen(PORT,function(){
  Logger.debug(`Server listening on PORT : ${PORT}`)
  console.log(`Server listening on PORT : ${PORT}`)
})

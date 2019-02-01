var PORT = 9000
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json({ type: 'application/*+json' }))

app.get("/",function(req,res){
  res.statusCode=200
  res.send("{ message: 'Listening well ...'}")
})
app.get("/webhook",function(req,res){
  var request_body = req.body ? req.body : req.query
  console.log("\nPayload\n",request_body);
  res.statusCode=200
  res.send("{message: 'ACKNOWLEDGED',status: 200}")
})

app.post("/webhook",function(req,res){
  var request_body = req.body ? req.body : req.query
  console.log("\nPayload\n",request_body);
  res.statusCode=200
  res.send("{message: 'ACKNOWLEDGED',status: 200}")
})

app.put("/webhook",function(req,res){
  var request_body = req.body ? req.body : req.query
  console.log("\nPayload\n",request_body)
  res.statusCode=200
  res.send("{message: 'ACKNOWLEDGED',status: 200}")
})
app.listen(PORT,function(){
  console.log("Listening on PORT: ",PORT)
})

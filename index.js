const express = require('express')
const app = express()
const port = 5001

const mongoose =require('mongoose');

const config=require('./config/key');
const { User } = require("./models/User");


mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify:false
}).then(()=> console.log('Mongdb Connected..'))
.catch(err =>console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!, 무야호, MOOYAHO')
})

app.listen(port, () => {
  console.log(`✅app listening at http://localhost:${port}!`)
})
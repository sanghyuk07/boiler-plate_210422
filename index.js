const express = require('express')
const app = express()
const port = 5001

const mongoose =require('mongoose')
mongoose.connect('mongodb+srv://sanghyuk:gmlsend134@bolierplate.ezt9p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify:false
}).then(()=> console.log('Mongdb Connected..'))
.catch(err =>console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`✅app listening at http://localhost:${port}`)
})
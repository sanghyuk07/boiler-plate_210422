const express = require('express')
const app = express()
const port = 5001
const bodyParser = require('body-parser');
const cookiePaser =require('cookie-parser');
const config=require('./config/key');
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({extended: true}));
//어플리케이션에서 받은 데이터를 분석해서 가져올 수 있게
app.use(bodyParser.json());
//제이슨 형태의 데이터를 가져올 수게 함. 클라이언트에서 오는 정보를 서버에서 분석해서 져올 수 있게함
app.use(cookiePaser());


const mongoose =require('mongoose');



//레지스터에서 사용하기 위함  


mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify:false
}).then(()=> console.log('Mongdb Connected..'))
.catch(err =>console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!, 무야호, MOOYAHO')
})

app.post('/register',(req, res)=> {
  //회원가입 할때 필요한 정보를 client 에서 가져오면
  //그것을 데이터 베이스에 넣어준다
  const user = new User(req.body)

  user.save((err, userInfo)=>{
    if(err) return res.json({success: false, err})
    //성공하지 못했을 때, success:false 와 함께 err 메시지도 전달한다
    return res.status(200).json({
      success:true
    })
  })
})

app.post('/login',(req,res)=> {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다. 
  User.findOne({ email : req.body.email},(err, user)=>{
    if(!user){
      return res.json({
        loginSucess:false,
        message:"제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

  //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
    user.comparePassword(req.body.password, (err, isMatch)=>{
      console.log('err',err)

      console.log('isMatch',isMatch)
     
      if(!isMatch)
        return res.json({loginSuccess: false, message:"비밀번호를 확인해주세요(틀렸습니다)"})
        //비밀번호까지 맞다면 토큰을 생성하기.
      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에?  쿠키, 로컬스토리지 
        res.cookie("x_auth",user.token)
          .status(200)
          .json({loginSuccess: true ,userId: user._id})


      })
    })
  })
})

app.listen(port, () => {
  console.log(`✅app listening at http://localhost:${port}!`)
})
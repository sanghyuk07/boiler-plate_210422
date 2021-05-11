const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRound =10;
//토큰의 전체 길이를 정해준다 
const jwt =require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength: 50,
    },
    email:{
        type:String,
        trim:true,
        // 스페이스를 없애주는 역할을 한다. 
        unique: 1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type: String,
        maxlength:50
    },
    role:{
        // 관리자와 일반 유저 분리 
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String
    },
    tokenExp:{
        // 토근 유지기간 설정 
        type:Number
    }
})
userSchema.pre('save',function( next ){

    var user = this;
    if(user.isModified('password')){
        //비밀번호를 암호화 시킨다
        bcrypt.genSalt(saltRound, function(err,salt){ //솔트를 만드는 함수
            bcrypt.hash(user.password, salt, function(err,hash){
                //해시를 비밀번호 DB에 저장한다
                if(err) return next(err)
                user.password =hash
                next()
            })
        })
    }else {
        next()
    }

    
})

userSchema.methods.comparePassword =function(plainPassword, cb){

    //plainPassword 1234567  암호화된 비밀번호 
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err),
        //비밀번호가 같지 않을 경우
            cb(null, isMatch)
            //같을 때는 에러 없이 ismatch
    })
}
userSchema.methods.generateToken=function(cb){
    var user = this;
    //jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user._id+ 'secreToken' =token
    // ->
    // 'secreToken' -> user._id
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)
    })
}

//실제 저장하기 전에 무엇을 한다는 뜻
const User =mongoose.model('User',userSchema)
module.exports={User}
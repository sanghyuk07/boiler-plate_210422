const mongoose = require('mongoose');

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

const User =mongoose.model('User',userSchema)
module.exports={User}
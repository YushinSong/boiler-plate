const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt가 몇글자인가
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        maxLength: 50
    },
    email: {
        type: String,
        trim: true, // 입력된 문자의 스페이스바(공백)삭제
        unique: 1 // 같은 이메일 쓰지 못함
    },
    password: {
        type: String,
        minLength:5
    },
    lastname: {
        type: String,
        maxLength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    Image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next){
    //비밀번호를 암호화시킨다.
    var user = this; // userSchema

    if(user.isModified('password')){ // 비밀번호가 변경될때만 비밀번호를 암호화해준다.
        bcrypt.genSalt(saltRounds, function(err, salt){ // salt를 생성
            if(err) return next(err); // 에러가 나면 바로 next로 보내기
            bcrypt.hash(user.password, salt, function(err, hash){ // userSchema의 password가져오기
                if(err) return next(err);
                user.password = hash;
                next()//git test
            })
        })
    } 
    else{ // 비밀번호가 아니라 다른 걸 바꾸었을 때
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword(1234567)와 암호화된 비밀번호가 일치하는지 체크하기 위해서는, 
    // plainPassword도 암호화한 후, 일치하는지 체크하면 된다.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;

    //jsonwebtoken을 이용해서 토큰을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secertToken');
    //user._id + 'secertToken' = token
    user.token = token;
    //user.save(function(err, user){
    //    if(err) return cb(err);
    //    cb(null, user)
    //})
    user.save().then(() => {
        return cb(null, user)
    }).catch((err)=>{
        return cb(err)
    })
}

const User = mongoose.model('User', userSchema) // 스키마를 모델로 감싸기

module.exports = {User} // 모델을 다른 파일에서도 쓸 수 있게 export

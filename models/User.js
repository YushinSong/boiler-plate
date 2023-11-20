const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt가 몇글자인가

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
                next()
            })
        })
    }
})

const User = mongoose.model('User', userSchema) // 스키마를 모델로 감싸기

module.exports = {User} // 모델을 다른 파일에서도 쓸 수 있게 export

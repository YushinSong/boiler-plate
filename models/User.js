const mongoose = require('mongoose');


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

const User = mongoose.model('User', userSchema) // 스키마를 모델로 감싸기

module.exports = {User} // 모델을 다른 파일에서도 쓸 수 있게 export

const express = require('express') // express 모듈 가져오기
const app = express() // 새로운 express 앱 만들기
const port = 5000 // 5000번 포트 백서버로 두기

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://yushin:1234@boilerplate.0mwywe3.mongodb.net/?retryWrites=true&w=majority', {
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요') // 루트 디렉토리에 hello world 출력되기 하기
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`) // 5000번 포트에서 이 앱을 실행하기
})
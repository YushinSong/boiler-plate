const express = require('express') // express 모듈 가져오기
const app = express() // 새로운 express 앱 만들기
const port = 5000 // 5000번 포트 백서버로 두기
const bodyParser = require('body-parser');
const config = require('./config/key');

const { User } = require("./models/User"); // 만들어둔 모델 가져오기

app.use(bodyParser.urlencoded({extened: true})); // 데이터 분석해서 가져올 수 있게 해줌

app.use(bodyParser.json()); // json 타입으로 된 것을 분석해서 가져올 수 있게 해줌

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요') // 루트 디렉토리에 hello world 출력되기 하기
})

app.post('/register', (req, res) => { // 회원가입을 위한 라우터
  //회원가입할 때 필요한 정보들을 cilent에서 가져오면,
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)
  user.save().then(()=>{ // save는 mongoDB의 함수. 유저모델에 저장.
    res.status(200).json({ 
        success:true
    })
  }).catch((err)=>{
    return res.json({success:false,err}) // 실패 메세지를 json형식으로 전달
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`) // 5000번 포트에서 이 앱을 실행하기
})
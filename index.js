const express = require('express') // express 모듈 가져오기
const app = express() // 새로운 express 앱 만들기
const port = 5000 // 5000번 포트 백서버로 두기
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const { User } = require("./models/User"); // 만들어둔 모델 가져오기

app.use(bodyParser.urlencoded({extened: true})); // 데이터 분석해서 가져올 수 있게 해줌

app.use(bodyParser.json()); // json 타입으로 된 것을 분석해서 가져올 수 있게 해줌
app.use(cookieParser());

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

app.post('/login', (req, res) => {
  // 요청된 이메일을 데이터베이스에 있는지 찾는다.
  User.findOne({email:req.body.email})
  .then((user)=>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }
    
    // 요청된 이메일이 데이터베이스에 있다면, 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch)=>{
      if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});

      // 비밀번호까지 맞다면, 유저를 위한 토큰을 생성하기
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키 or 로컬
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id});
      })
    })
  })
  .catch((err)=>{
    return res.status(400).send(err);
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`) // 5000번 포트에서 이 앱을 실행하기
})
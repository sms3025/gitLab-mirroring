const express = require('express');
const path = require('path')
const app = express();
const session = express('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const diaryRoutes = require('./routes/diaries');
const crewRoutes = require('./routes/crews');
const exp = require('constants');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const dbUrl = 'mongodb://127.0.0.1:27017/health-crew';
const MongoDBStore = require("connect-mongo")(session);
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});


const sessionConfig = { //세션 정보 추가
    store, //저장소 정보
    name: 'session',
    secret, // 암호화 정보
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //간단한 보안 기능
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig)); //이러한 정보를 가진 세션 사용(미들웨어를 쓰는것 만으로 자동으로 session정보에 접근할 수 있는 cookie를 보낸다.)
app.use(flash()); // flash 사용

app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/diary', diaryRoutes);
app.use('/crews', crewRoutes);


app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})
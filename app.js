const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const exp = require('constants');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const dbUrl = 'mongodb://127.0.0.1:27017/health-crew';
const User = require('./models/user');

const userRoutes = require('./routes/users');
const diaryRoutes = require('./routes/diaries');
const exploreRoutes = require('./routes/explores')
const crewRoutes = require('./routes/crews');


const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
})


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
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(dbUrl)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!");
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR");
        console.log(err);
    })

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes)
app.use('/diary', diaryRoutes);
app.use('/crew', crewRoutes);
//app.use('/explore')


app.get('/', (req, res) => {
    res.send('home');
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
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

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
const mongoSanitize = require('express-mongo-sanitize');
//const helmet = require('helmet');
const cron = require('node-cron');


const { swaggerUi, specs } = require('./modules/swagger');
const { updateRanking } = require('./controllers/ranking');

const userRoutes = require('./routes/users');
const diaryRoutes = require('./routes/diaries');
const exploreRoutes = require('./routes/explores');
const crewRoutes = require('./routes/crews');
const notionRoutes = require('./routes/notions');
const rankingRoutes = require('./routes/rankings');
const homepageRoutes = require('./routes/homepage');


const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
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
app.use(mongoSanitize());
// app.use(helmet({
//     contentSecurityPolicy: false,
//     crossOriginResourcePolicy: false,
//     crossOriginOpenerPolicy: false
// }));

app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.json());
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', userRoutes);
app.use('/home', homepageRoutes);
app.use('/diary', diaryRoutes);
app.use('/crew', crewRoutes);
app.use('/crew/:crewId/notion', notionRoutes);
app.use('/crew/:crewId/ranking', rankingRoutes);
app.use('/explore', exploreRoutes);


// 매월 0시에 실행
// cron.schedule('0 0 1 * *', updateRanking);
cron.schedule('0 0 * * *', async () => {
    const users = await User.find({});
    const promises = users.map(async (user) => {
        user.goal = [];
        await user.save();
    });
    await Promise.all(promises);
},
    {
        scheduled: true,
        timezone: "Asia/Seoul"
    });

app.get('/', (req, res) => {
    res.send('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = '예기치 못한 오류가 생겼습니다.'
    res.status(statusCode).send(err);
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})
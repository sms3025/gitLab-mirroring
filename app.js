
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
app.set('trust proxy', 1);
app.use(function (req, res, next) {

    if (req.method === 'OPTIONS') {
        const headers = {};
        headers["Access-Control-Allow-Origin"] = "http://localhost:5173";
        headers["Access-Control-Allow-Methods"] = "POST, GET, DELETE, OPTIONS, PUT";
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin, Authorization, X-PINGOTHER";
        headers["Access-Control-Allow-Credentials"] = true;
        headers["Access-Control-Max-Age"] = '86400';
        res.writeHead(200, headers);
        res.end();
    }
    else {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        res.setHeader("Access-Control-Allow-Methods", 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, X-Auth-Token, X-PINGOTHER');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Max-Age', '60');
        next();
    }
});

const sessionConfig = { //세션 정보 추가
    store, //저장소 정보
    name: 'session',
    secret, // 암호화 정보
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, //간단한 보안 기능
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        //sameSite: 'none'
    }
}

app.use(session(sessionConfig)); //이러한 정보를 가진 세션 사용(미들웨어를 쓰는것 만으로 자동으로 session정보에 접근할 수 있는 cookie를 보낸다.)
app.use(flash()); // flash 사용
app.use(mongoSanitize());

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')))
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
app.use('/homepage', homepageRoutes);
app.use('/diary', diaryRoutes);
app.use('/crew', crewRoutes);
app.use('/crew', notionRoutes);
app.use('/crew', rankingRoutes);
app.use('/explore', exploreRoutes);



if (process.env.INSTANCE_ID === '0') {
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
    cron.schedule('0 0 1 * *', updateRanking, {scheduled: true, timezone: 'Asia/Seoul'});
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = '예기치 못한 오류가 생겼습니다.'
    res.status(statusCode).send(err);
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'))
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})

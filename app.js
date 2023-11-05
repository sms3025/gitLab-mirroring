const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const app = express();
const session = express('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const diaryRoutes = require('./routes/diaries');
const crewRoutes = require('./routes/crews');
const exp = require('constants');
const dbUrl = 'mongodb://127.0.0.1:27017/health-crew';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use('/diary', diaryRoutes);
app.use('/crew', crewRoutes);
app.use('/explore')


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
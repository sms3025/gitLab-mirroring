const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const app = express();
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const exp = require('constants');
const dbUrl = 'mongodb://127.0.0.1:27017/health-crew';

const userRoutes = require('./routes/users');
const diaryRoutes = require('./routes/diaries');
const exploreRoutes = require('./routes/explores')
const crewRoutes = require('./routes/crews');

mongoose.connect(dbUrl)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!");
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR");
        console.log(err);
    })

app.use('/', userRoutes);
app.use('/explore', exploreRoutes);
app.use('/diary', diaryRoutes);
app.use('/crew', crewRoutes);


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
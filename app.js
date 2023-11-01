const express = require('express');
const path = require('path')
const app = express();
const ExpressError = require('./utils/ExpressError');
const diaryRoutes = require('./routes/diaries');
const crewRoutes = require('./routes/crews');


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
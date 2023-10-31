const express = require('express');
const path = require('path')


const diaryRoutes = require('./routes/diaries');
const app = express();
app.use('/diary', diaryRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})
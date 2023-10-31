const express = require('express');
const path = require('path');
const crewRoutes = require('./routes/crews');
const app = express();

app.use('/crews', crewRoutes);


app.get('/', (req, res) => {
    res.render('home');
})


app.listen(3000, () => {
    console.log('Listening on port 3000');
})
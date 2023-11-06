const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.route('/register')
    .get((req, res) => {
        res.status(200).send("register");
    })
    .post(catchAsync(async (req, res, next) => {
        try {
            const { name, loginid, password, nickname } = req.body;
            //console.log(req.body);
            const user = new User({ name, loginid, nickname })
            const newUser = await User.register(user, password);
            // req.login(newUser, err => {
            //     if (err) return next(err);
            //     res.status(200);
            // })
            res.status(200).send("register OK");
        } catch (e) {
            res.status(400).send(e);
        }
    }))

router.route('/login')
    .get((req, res) => {
        res.status(200).send("login");
    })
    .post(passport.authenticate('local', { failureFlash: true }), catchAsync(async (req, res) => {
        res.status(200).send("login success");
    }))

router.route('/logout')
    .get((req, res) => {
        res.status(200).send("logout success");
    })
    .post(catchAsync((req, res, next) => {
        req.logout(err => {
            if (err) {
                return next(err);
            }
        });
        res.status(200).send("logout success");
    }))

module.exports = router;
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const ExpressError = require('../utils/ExpressError');

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

router.route('/changepassword')
    .get()
    .post(isLoggedIn, catchAsync(async (req, res) => {
        const { oldPassword, password, password2 } = req.body;
        if (password !== password2) {
            res.status(400).send("password errer");
            throw new ExpressError("PASSWORD ERROR");
        } else {
            const user = await User.findById(req.user._id);
            await user.changePassword(oldPassword, password);
            res.status(200).send("change password!!");
        }
    }))

router.route('/setpassword')
    .get()
    .post((req, res) => {

    })

module.exports = router;
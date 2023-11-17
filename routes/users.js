const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.showRegister)
    .post(catchAsync(users.createRegister))
    .delete(isLoggedIn, catchAsync(users.deleteRegister))

router.route('/login')
    .get(users.showLogin)
    .post(passport.authenticate('local', { failureFlash: true }), users.createLogin)

router.route('/logout')
    .get(users.showLogout)
    .post(isLoggedIn, catchAsync(users.createLogout))

router.route('/changepassword')
    .get(users.showChangePassword)
    .put(isLoggedIn, catchAsync(users.changePassword))

router.route('/findpassword')
    .get(users.showFindPassword)
    .post(catchAsync(users.findPassword))

router.route('/mypage')
    .get(isLoggedIn, catchAsync(users, users.showMyPage))
    .delete(isLoggedIn, catchAsync(users.deleteMyPage))
    .put(isLoggedIn, catchAsync(users.addMyPage))

module.exports = router;
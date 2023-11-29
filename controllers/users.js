const express = require('express');
const User = require('../models/user');
const Crew = require('../models/crew');
const ExpressError = require('../utils/ExpressError');
const { deleteImage } = require('../aws/index');
const nodemailer = require('nodemailer');
require('dotenv').config();
const variable = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");
//비밀번호 랜덤 함수
function createRandomPassword(variable, passwordLength) {
    let randomString = "";
    for (var j = 0; j < passwordLength; j++)
        randomString += variable[Math.floor(Math.random() * variable.length)];
    return randomString
}

module.exports.createRegister = async (req, res) => {
    try {
        const { name, loginid, password, nickname, email } = req.body;
        //console.log(req.body);
        if (!password) {
            throw new ExpressError("패스워드가 없습니다.", 403);
        }
        const user = new User({ name, loginid, nickname, email })
        const newUser = await User.register(user, password);
        // req.login(newUser, err => {
        //     if (err) return next(err);
        //     res.status(200);
        // })
        res.status(200).send("등록이 완료되었습니다.");
    } catch (e) {
        throw new ExpressError("중복회원이 존재합니다.", 403);
    }
}

module.exports.deleteRegister = async (req, res) => {
    const userId = req.user._id;
    req.session.destroy(function () {
        req.session;
    });
    const user = await User.findById(userId);
    if (!user) {
        throw new ExpressError("존재하지 않는 유저 아이디입니다.", 400);
    }
    const filename = user.image.filename;
    if (filename) {
        deleteImage(filename);
    }
    await Crew.updateMany({}, { $pullAll: { users: [userId] } })
    await User.deleteOne({ _id: userId });
    res.status(200).send("유저 삭제 성공");
}

module.exports.createLogin = (req, res) => {
    res.status(200).send("로그인 성공!");
}

module.exports.createLogout = (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
    });
    req.logout(err => {
        if (err) {
            return next(err);
        }
    });
    res.status(200).send("로그아웃 성공!");
}

module.exports.changePassword = async (req, res) => {
    const { oldPassword, password, password2 } = req.body;
    if (password !== password2) {
        throw new ExpressError("패스워드가 일치하지 않습니다.", 401);
    } else {
        const user = await User.findById(req.user._id);
        await user.changePassword(oldPassword, password);
        res.status(200).send("change password!!");
    }
}

module.exports.findPassword = async (req, res) => {
    const oldloginid = req.body.loginid;
    const user = await User.findOne({ loginid: oldloginid }).populate('crews');
    if (!user) {
        throw new ExpressError("유효하지 않은 유저 아이디 입니다.", 401);
    }
    const randomPassword = createRandomPassword(variable, 8);
    const name = user.name;
    const loginid = user.loginid;
    const email = user.email;
    const nickname = user.nickname;
    const image = user.image;
    const goal = user.goal;
    const crews = user.crews;
    await User.deleteOne({ loginid: loginid });
    const newUser = new User({ name, loginid, email, nickname, image, goal, crews });
    await User.register(newUser, randomPassword);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: { // 이메일을 보낼 계정 데이터 입력
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const emailOptions = { // 옵션값 설정
        from: 'Goguma@gmail.com',
        to: user.email,
        subject: 'Goguma에서 임시비밀번호를 알려드립니다.',
        html:
            "<h1 >Goguma에서 새로운 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : " + randomPassword + "</h2>"
            + '<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요.</h3>'
    };
    transporter.sendMail(emailOptions);
    res.status(200).send("비밀번호 변경 성공!");
}

module.exports.showMyPage = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById({ _id: userId })
        .populate('crews')
    if (!user) {
        throw new ExpressError("유효하지 않은 유저 아이디 입니다.", 401);
    }
    res.status(200).send(user);
}

module.exports.deleteMyPage = async (req, res) => {
    const userId = req.user_id;
    const idx = req.body.idx;
    const user = await User.findById({ _id: userId })
    if (!user) {
        throw new ExpressError("유효하지 않은 유저 아이디 입니다.", 401);
    }
    user.goal.splice(idx, 1);
    await user.save();
    res.status(200).send(user);
}

module.exports.addMyPage = async (req, res) => {
    const userId = req.user_id;
    const text = req.body.text;
    const user = await User.findById({ _id: userId })
    if (!user) {
        throw new ExpressError("유효하지 않은 유저 아이디 입니다.", 401);
    }
    user.goal.push(text);
    await user.save();
    res.status(200).send(user);
}

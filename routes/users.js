const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users');

/**
 * @swagger
 * /register:
 *  get:
 *     tags: [user]
 *     summary: 유저 등록 페이지 보여주기
 *     responses:
 *      "200":
 *          description: 등록 페이지 보여주기 OK 
 *  post:
 *     tags: [user]
 *     summary: 유저 정보 받아서 등록하기
 *     description: form data로 유저 정보 전송
 *     requestBody:
 *         content: 
 *           application/x-www-form-urlencoded:
 *              schema:
 *                 type: object
 *                 properties: 
 *                  name:   
 *                      type: string
 *                      description: 유저 이름
 *                  loginid: 
 *                       type: string
 *                       description: 유저 아이디
 *                  password: 
 *                      type: string
 *                      description: 유저 비밀번호
 *                  nickname: 
 *                      type: string
 *                      description: 유저 닉네임
 *                  email: 
 *                      type: string
 *                      description: 유저 이메일
 *     responses:
 *      "200":
 *          description: 유저 등록 성공
 *  delete:
 *     tags: [user]
 *     summary: 유저 삭제하기
 * 
 */

router.route('/register')
    .get(users.showRegister)
    .post(catchAsync(users.createRegister))
    .delete(isLoggedIn, catchAsync(users.deleteRegister))
/**
 * @swagger
 * /login:
 *  get:
 *     tags: [user]
 *     summary: 유저 로그인 페이지 보여주기
 *     responses:
 *      "200":
 *          description: 등록 로그인 페이지 보여주기 OK * 
 *  post:
 *     tags: [user]
 *     summary: 유저 로그인 하기
 *     description: form data로 유저 로그인 정보 전송
 *     requestBody:
 *         content: 
 *           application/x-www-form-urlencoded:
 *              schema:
 *                 type: object
 *                 properties: 
 *                  username: 
 *                      type: string
 *                      description: 유저 아이디(loginid)
 *                  password: 
 *                      type: string
 *                      description: 유저 비밀번호
 *     responses:
 *      "200":
 *          description: 로그인 성공 
 *     
 */

router.route('/login')
    .get(users.showLogin)
    .post(passport.authenticate('local', { failureFlash: true }), users.createLogin)
/**
 * @swagger
 * /logout:
 *  get:
 *     tags: [user]
 *     summary: 유저 로그아웃 페이지 보여주기
 *     responses:
 *      "200":
 *          description: 로그아웃 페이지 보여주기 OK 
 *  post:
 *     tags: [user]
 *     summary: 유저 로그아웃 하기
 *     responses:
 *      "200":
 *          description: 로그아웃 성공 
 * 
 *     
 */

router.route('/logout')
    .get(users.showLogout)
    .post(isLoggedIn, catchAsync(users.createLogout))
/**
 * @swagger
 * /changepassword:
 *  get:
 *     tags: [user]
 *     summary: 유저 비밀번호 변경 페이지 보여주기
 *     responses:
 *      "200":
 *          description: 비밀번호 변경 페이지 보여주기 OK
 *  put:
 *     tags: [user]
 *     summary: 유저 비밀번호 변경 하기
 *     description: form data로 유저 비밀번호 정보 전송
 *     requestBody:
 *         content: 
 *           application/x-www-form-urlencoded:
 *              schema:
 *                 type: object
 *                 properties: 
 *                  oldPassword: 
 *                      type: string
 *                      description: 유저 원래 비밀번호
 *                  password: 
 *                      type: string
 *                      description: 유저가 바꿀 비밀번호
 *                  password2:
 *                      type: string
 *                      description: 유저가 바꿀 비밀번호 확인
 *     responses:
 *      "200":
 *          description: 비밀번호 변경 성공 
 *     
 */

router.route('/changepassword')
    .get(users.showChangePassword)
    .put(isLoggedIn, catchAsync(users.changePassword))
/**
 * @swagger
 * /findpassword:
 *  get:
 *     tags: [user]
 *     summary: 유저 비밀번호 찾기 페이지 보여주기
 *     responses:
 *      "200":
 *          description: 유저 비밀번호 찾기 페이지 보여주기 OK 
 *  put:
 *     tags: [user]
 *     summary: 유저 비밀번호 찾기에서 비밀번호 초기화 메일 보내기
 *     description: form data로 유저 아이디 정보 전송하면 유저가 등록한 이메일로 비밀번호 정보 전송
 *     requestBody:
 *         content: 
 *           application/x-www-form-urlencoded:
 *              schema:
 *                 type: object
 *                 properties: 
 *                  loginid: 
 *                      type: string
 *                      description: 비밀번호 찾을 아이디    
 *     responses:
 *      "200":
 *          description: 비밀번호 변경 성공
 *     
 */

router.route('/findpassword')
    .get(users.showFindPassword)
    .post(catchAsync(users.findPassword))
/**
 * @swagger
 * /mypage:
 *  get:
 *     tags: [user]
 *     summary: 유저 마이 페이지 보여주기
 *     responses:
 *      "200":
 *          description: 유저 정보 보내주기(마이페이지 보여주기 성공)
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *                  
 *  delete:
 *     tags: [user]
 *     summary: 유저 마이 페이지 삭제하기
 *     requestBody:
 *         content: 
 *           application/x-www-form-urlencoded:
 *              schema:
 *                 type: object
 *                 properties: 
 *                  idx: 
 *                      type: string
 *                      description: 마이페이지 삭제할 idx
 *     responses:
 *      "200":
 *          description: 유저 정보 보내주기(마이페이지 보여주기 성공)
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User' 
 *  put:
 *     tags: [user]
 *     summary: 유저 마이 페이지 추가하기
 *     requestBody:
 *         content: 
 *           application/x-www-form-urlencoded:
 *              schema:
 *                 type: object
 *                 properties: 
 *                  text: 
 *                      type: string
 *                      description: 마이페이지에 추가할 텍스트 정보
 *     responses:
 *      "200":
 *          description: 유저 정보 보내주기(마이페이지 보여주기 성공)
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *     
 */
router.route('/mypage')
    .get(isLoggedIn, catchAsync(users, users.showMyPage))
    .delete(isLoggedIn, catchAsync(users.deleteMyPage))
    .put(isLoggedIn, catchAsync(users.addMyPage))

module.exports = router;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user')

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'loginid',
    
  }, async (loginid, done) => {
    try {
      const exUser = await User.findOne({ where: { loginid } });
      if (exUser) {
        done(null, exUser);
      } 
      else {
        done(null, false, { message: '가입되지않은 회원입니다.' });
      }
    } catch (error) {
    //   console.error(error);
      done(error);
    }
  }))
}
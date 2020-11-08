var Jwt = require('jsonwebtoken');
const passport = require('passport');
var config = require('../config');
var User = require('../models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var localStrategy = require('passport-local').Strategy;

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/* la Stratégie local */

module.exports.local = passport.use(new localStrategy(User.authenticate()));

/* Verifying the User token */

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

module.exports.jwtPassport = passport.use(new JwtStrategy(opts,(jwt_payload,done) => {
    User.findOne({_id:jwt_payload._id})
    .then((user) => {
        if(user){
            done(null,user);
        }else{
            done(null,false);
        }
    })
    .catch((err) => done(err,false));
}));

module.exports.verifyUser = passport.authenticate('jwt',{session:false});

/* creating the Token */

module.exports.getToken = ((user) => {
    return Jwt.sign(user,config.secretKey,{
        expiresIn:3600
    });
});


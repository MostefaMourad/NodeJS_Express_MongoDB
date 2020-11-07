var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var router = express.Router();
router.use(bodyParser.json());
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',function(req,res,next) {
  User.register(new User({username:req.body.username}),req.body.password,
  (err,user) => {
    if(err){
      res.statusCode = 500;
      next(err); 
    }else{
      passport.authenticate('local')(req,res,() => {
        res.statusCode = 201 ;
        res.setHeader('Content-Type','application/json');
        res.json({sucess:true,status:'Registration sucessfull !'})
      });
    }
  });
})

router.post('/login',passport.authenticate('local'),(req,res) => {
    res.statusCode = 200 ;
    res.setHeader('Content-Type','application/json');
    res.json({sucess:true,status:'You are logged in'});
});

router.get('/logout',(req,res) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    err = new Error('YOu are not logged in ');
    res.statusCode = 403 ;
    next(err);
  }
});

module.exports = router;

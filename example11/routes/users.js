var express = require('express');
var router = express.Router();
var User = require('../models/users');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var passport = require('passport');
var authenticate = require('../middleware/authenticate');

/* GET users listing. */
router.get('/', authenticate.verifyUser,authenticate.verifyAdmin,function(req, res, next) {
  User.find({})
  .then((users) => {
    res.statusCode = 200 ;
    res.setHeader('Content-Type','json/application');
    res.json(users);
  })
  .catch((err) => next(err));
});

router.post('/signup', (req,res,next) => {
  User.register(new User({
    username:req.body.username,
    firstname:req.body.firstname,
    lastname:req.body.lastname
  }),req.body.password)
  .then( (user) => {
    passport.authenticate('local')(req,res,() => {
        res.statusCode = 201 ;
        res.setHeader('Content-Type','application/json');
        res.json({sucess:true,token:authenticate.getToken({_id:user._id}),status:'Registration successful'});
    });
  })
  .catch((err) => next(err));
})

router.post('/login',passport.authenticate('local'),(req,res,next) =>{
  res.statusCode = 200 ;
  res.setHeader('Content-Type','application/json');
  res.json({sucess:true,token:authenticate.getToken({_id:req.user._id}),status:'You are logged in'});
});

module.exports = router;

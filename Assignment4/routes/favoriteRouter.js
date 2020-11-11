const express = require('express');
const Favorite = require('../models/favorite');
const bodyParser = require('body-parser');
const authenticate = require('../middleware/authenticate');

var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.all(authenticate.verifyUser,(req,res,next) => {
    next();
})
.get((req,res,next) => {
    Favorite.findOne({user:req.user._id})
    .then((favorite) => {
        if(favorite){
            Favorite.findById(favorite._id)
            .populate('dishes')
            .populate('user')
            .then((favorite) => {
                res.statusCode = 200 ;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            })
            .catch((err) => next(err));
        }else{
            res.statusCode = 403 ;
            err = new Error("You have no favourite dishes");
            next(err);
        }
    })
    .catch((err)=>next(err));
})
.post((req,res,next) => {
    if(Array.isArray(req.body)){
        Favorite.findOne({user:req.user._id})
        .then((favorite) => {
            if(favorite){
                favorite.dishes = (favorite.dishes).concat((req.body).filter((item) => (favorite.dishes).indexOf(item) < 0)); 
            }else{
                favorite = new Favorite({user:req.user._id,dishes:req.body});
            }
            favorite.save().then(() => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            });
        })
        .catch((err) => next(err));
    }
    else{
        res.statusCode = 403 ;
        err = new Error('No Dishes are included in the request');
        next(err);
    }
})
.put((req,res,next) => {
    res.statusCode = 403 ;
    err = new Error('PUT operation not supported on /favorites');
    next(err);
})
.delete((req,res,next) => {
    Favorite.findOne({user:req.user._id})
    .then((favorite) => {
        if(favorite){
            favorite.deleteOne()
            .then((favorite)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            })
            .catch((err) => next(err));
        }else{
            res.statusCode = 403 ;
            err = new Error("You have no favourite dishes");
            next(err); 
        }
    })
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.all()
.get()
.post()
.put()
.delete();

module.exports = favoriteRouter ;


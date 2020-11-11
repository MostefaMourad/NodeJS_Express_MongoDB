const express = require('express');
const Favorite = require('../models/favorite');
const Dish = require('../models/dishes');
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
.all(authenticate.verifyUser,(req,res,next) => {
    next();
})
.get((req,res,next) => {
    res.statusCode = 403 ;
    err = new Error('GET operation not supported on /favorites/'+req.params.dishId);
    next(err);
})
.post((req,res,next) => {
    Dish.findById(req.params.dishId) // Check if the dish exists in the database
    .then((dish) =>{
        if(dish){
            Favorite.findOne({user:req.user._id}) // check if the favorite document exists
            .then((favorite) => {
                if(favorite){
                    if((favorite.dishes).indexOf(req.params.dishId) < 0){
                        (favorite.dishes).push(req.params.dishId);
                    }   
                }else{
                    favorite = new Favorite({user:req.user._id,dishes:[]});
                    (favorite.dishes).push(req.params.dishId);
                }
                favorite.save().then(() => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                });
            })
            .catch((err) => next(err));
        }else{
            res.statusCode = 403 ;
            err = new Error('The Dish does not exist');
            next(err);
        }
    })
    .catch((err) => next(err));  
})
.put((req,res,next) => {
    res.statusCode = 403 ;
    err = new Error('PUT operation not supported on /favorites/'+req.params.dishId);
    next(err); 
})
.delete((req,res,next) => {
    Dish.findById(req.params.dishId) // Check if the dish exists in the database
    .then((dish) =>{
        if(dish){
            Favorite.findOne({user:req.user._id}) // check if the favorite document exists
            .then((favorite) => {
                if(favorite){
                    if((favorite.dishes).indexOf(req.params.dishId) < 0){
                        res.statusCode = 403 ;
                        err = new Error("The Dish isn't in your list of favourite dishes");
                        next(err);
                    }else{
                        favorite.dishes = (favorite.dishes).filter((item) => (favorite.dishes).indexOf(item) !== (favorite.dishes).indexOf(req.params.dishId)); 
                        favorite.save().then(() => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type','application/json');
                            res.json(favorite);
                        });
                    }   
                }else{
                    res.statusCode = 403 ;
                    err = new Error("You have no favourite dishes");
                    next(err);
                }
            })
            .catch((err) => next(err));
        }else{
            res.statusCode = 403 ;
            err = new Error('The Dish does not exist');
            next(err);
        }
    })
    .catch((err) => next(err));
});

module.exports = favoriteRouter ;

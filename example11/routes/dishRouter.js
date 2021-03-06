const express = require('express');
const bodyParser = require('body-parser');
const Dishes = require('../models/dishes');
const authenticate = require('../middleware/authenticate');
const cors = require('../middleware/cors');


const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOPtions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.find({}).then( (dishes)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.create(req.body)
    .then( (dish) => {
        console.log('Dish created',dish);
        res.statusCode = 201;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.deleteMany({})
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err)=> next(err));
});

dishRouter.route('/:dishId')
.options(cors.corsWithOPtions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then( (dish) => {
        res.statusCode = 201;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{new:true})
    .then( (dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err)=> next(err));
});


dishRouter.route('/:dishId/comments')
.options(cors.corsWithOPtions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then( (dish) => {
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        }
        else{
            err = new Error('Dish '+req.params.dishId+' not found');
            err.statusCode = 404;
            next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOPtions,authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then( (dish) => {
        if(dish != null){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save().then(  () => {
                res.statusCode = 201;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err) => next(err));
        }
        else{
            err = new Error('Dish '+req.params.dishId+' not found');
            err.statusCode = 404;
            next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes' + req.params.dishId + '/comments');
})
.delete(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then( (dish) => {
        if(dish != null){
            for(var i = (dish.comments.length -1) ; i >= 0 ;i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save().then(  () => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err) => next(err));
            
        }
        else{
            err = new Error('Dish '+req.params.dishId+' not found');
            err.statusCode = 404;
            next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOPtions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then( (dish) => {
        if( (dish != null) && (dish.comments.id(req.params.commentId) != null) ){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else{
            if(dish == null){
                err = new Error('Dish '+req.params.dishId+' not found');
                err.statusCode = 404;
                next(err);
            }else{
                err = new Error('Comment '+req.params.commentId+' not found');
                err.statusCode = 404;
                next(err);
            }
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOPtions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+req.params.dishId+'/comments/'+req.params.commentId);
})
.put(cors.corsWithOPtions,authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then( (dish) => {
        if((dish != null) && (dish.comments.id(req.params.commentId) != null)){
            if((dish.comments.id(req.params.commentId).author).equals(req.user._id)){ // check if the user is the owner of the comment
                if(req.body.rating){
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if(req.body.comment){
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                dish.save().then(  () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                },(err) => next(err));
            }
            else{
                res.statusCode = 403 ;
                err = new Error("You are not authorized to perform this operation!");
                next(err);
            }
        }
        else{
            if(dish == null){
                err = new Error('Dish '+req.params.dishId+' not found');
                err.statusCode = 404;
                next(err);
            }else{
                err = new Error('Comment '+req.params.commentId+' not found');
                err.statusCode = 404;
                next(err);
            }
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOPtions,authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then( (dish) => {
        if((dish != null) && (dish.comments.id(req.params.commentId) != null)){
            if((dish.comments.id(req.params.commentId).author).equals(req.user._id)){ // check if the user is the owner of the comment
                dish.comments.id(req.params.commentId).remove();
                dish.save().then(  () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                },(err) => next(err));   
            }
            else{
                res.statusCode = 403 ;
                err = new Error("You are not authorized to perform this operation!");
                next(err);
            }
        }
        else{
            if(dish == null){
                err = new Error('Dish '+req.params.dishId+' not found');
                err.statusCode = 404;
                next(err);
            }else{
                err = new Error('Comment '+req.params.commentId+' not found');
                err.statusCode = 404;
                next(err);
            }
        }
    },(err) => next(err))
    .catch((err) => next(err));
});





module.exports = dishRouter;
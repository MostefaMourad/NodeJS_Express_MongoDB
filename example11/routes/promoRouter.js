const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');
const promotionRouter = express.Router();
const authenticate = require('../middleware/authenticate');
const cors = require('../middleware/cors');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.options(cors.corsWithOPtions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Promotions.find({})
    .then( (promotions) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.create(req.body)
    .then( (promotion) => {
        res.statusCode = 201 ;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    err = new Error('PUT operation not supported on /promotions');
    next(err);
})
.delete(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.deleteMany({})
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','json/application');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

promotionRouter.route('/:promoId')
.get(cors.cors,(req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then( (promotion) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    err = new Error('POST operation not supported on /promotions/'+req.params.promoId);
    next(err);
})
.put(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId,
        {
            $set:req.body
        },{new:true})
        .then((promotion) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','json/application');
            res.json(promotion);
        },(err) => next(err))
        .catch((err) => next(err));
})
.delete(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','json/application');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


module.exports = promotionRouter;
const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');
const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then( (promotions) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Promotions.create(req.body)
    .then( (promotion) => {
        res.statusCode = 201 ;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    err = new Error('PUT operation not supported on /promotions');
    next(err);
})
.delete((req, res, next) => {
    Promotions.deleteMany({})
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','json/application');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

promotionRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then( (promotion) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err)=>next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    err = new Error('POST operation not supported on /promotions/'+req.params.promoId);
    next(err);
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','json/application');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


module.exports = promotionRouter;
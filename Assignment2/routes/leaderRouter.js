const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/dishes');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then( (leaders) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Leaders.create(req.body)
    .then( (leader) => {
        res.statusCode = 201 ;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    err = new Error('PUT operation not supported on /Leaders');
    next(err);
})
.delete((req, res, next) => {
    Leaders.deleteMany({})
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','json/application');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then( (leader) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err) => next(err))
    .catch((err)=>next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    err = new Error('POST operation not supported on /Leaders/'+req.params.leaderId);
    next(err);
})
.put((req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,
        {
            $set:req.body
        },{new:true})
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','json/application');
            res.json(leader);
        },(err) => next(err))
        .catch((err) => next(err));
})
.delete((req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','json/application');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


module.exports = leaderRouter;
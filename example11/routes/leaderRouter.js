const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');
const authenticate = require('../middleware/authenticate');
const cors = require('../middleware/cors');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOPtions,(req,res) => {
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Leaders.find({})
    .then( (leaders) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leaders.create(req.body)
    .then( (leader) => {
        res.statusCode = 201 ;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    err = new Error('PUT operation not supported on /Leaders');
    next(err);
})
.delete(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leaders.deleteMany({})
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','json/application');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderId')
.get(cors.cors,(req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then( (leader) => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err) => next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    err = new Error('POST operation not supported on /Leaders/'+req.params.leaderId);
    next(err);
})
.put(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
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
.delete(cors.corsWithOPtions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','json/application');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
});


module.exports = leaderRouter;
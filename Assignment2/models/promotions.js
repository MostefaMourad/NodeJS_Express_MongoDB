const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

const promoSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:'',
    },
    price:{
        type:Currency,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:String,
        default:false
    }
},{timestamps:true});

var Promotions = mongoose.model('Promotion',promoSchema);

module.exports = Promotions;
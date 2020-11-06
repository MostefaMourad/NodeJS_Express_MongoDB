const mongoClient = require('mongodb');
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = "conFusion";

mongoClient.connect(url).then((client) => {
    console.log('Connected correctly to the server');
    const db = client.db(dbname);
    dboper.insertDocument(db,{name:"7loww",description:"mnweii"},'dishes').then((result) => {
        console.log("Insert document \n",result.ops);
        return dboper.findDocuments(db,'dishes')})
        .then((docs)=> {
            console.log("Found documents"+docs);
            return dboper.updateDocument(db,{name:"7loww"},{description:"welah skaker"},'dishes')
        })
        .then((result)=>{
            console.log("Updated document"+result.result);
            return dboper.findDocuments(db,'dishes')
        })
        .then((docs)=>{
            console.log("Found documents"+docs);
            return db.dropCollection('dishes')
        })
        .then((result) => {
            console.log('Dropped collection :',result);
            client.close();
        }).catch((err)=> console.log(err));
})
.catch((err)=> console.log(err)); 

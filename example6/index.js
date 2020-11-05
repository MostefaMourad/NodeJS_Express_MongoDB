const mongoClient = require('mongodb');
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = "conFusion";

mongoClient.connect(url, (err,client) => {
    assert.equal(err,null);
    console.log('Connected correctly to the server');
    const db = client.db(dbname);
    const collection = db.collection('dishes');
    collection.insert({"name":"7riea","description":"mestiikiyaa"},(err,result)=>{
        assert.equal(err,null);
        console.log('After Insert:\n');
        console.log(result.ops);
        collection.find({}).toArray((err,docs)=>{
            assert.equal(err,null);
            console.log(docs);
            db.dropCollection('dishes',(err,result)=>{
                assert.equal(err,null);
                client.close();
            });
        })
    });
});


const mongoCollections = require("../config/mongoCollections");
const CandyDataInfo = mongoCollections.CandyData;
let { ObjectId } = require('mongodb');

async function getAll() {
    const candyDataCollection = await CandyDataInfo();
    const Candies = await candyDataCollection.find({}).toArray();
    for (let i = 0; i < Candies.length; i++) {
        Candies[i]._id = Candies[i]._id.toString();
    }
    return Candies;
}

async function getById(id) {
    if (!id) throw '[data]Id parameter must be supplied';

    if (typeof (id) !== 'string') throw "[data]Id must be a string";

    if (id.trim().length === 0) throw "[data] the input include all space"

    if (!ObjectId.isValid(id)) throw "[data] the invalid ObjectId"
    const candyDataCollection = await CandyDataInfo();

    const search = await candyDataCollection.findOne({ _id: ObjectId(id) });

    if (search === null) throw "no candy fit with this id";

    search._id = search._id.toString()

    return search;
}

async function getByName(name){
    if(!name) throw '[data] Name must provide'
    if(typeof(name) !== 'string') throw '[data]Name must be a string'
    if(name.trim().length ===0) throw '[data]Name can not be all white space'
    const candyDataCollection = await CandyDataInfo();
    const search = await candyDataCollection.findOne({ name: name });
    if (search === null) throw "no candy fit with this name";
    return search

    
}

async function getByRating(rate){
    if(!rate) throw '[data] rate must provide'
    if(typeof(rate) !== 'number') throw '[data]Name must be a Number'
    const candyDataCollection = await CandyDataInfo();
    const search = await candyDataCollection.find({ rating: {$gt: rate} });
    if (search === null) throw "no candy fit with this id";
    return search

    
}


module.exports = {
    getAll,
    getById,
    getByName,
    getByRating


}
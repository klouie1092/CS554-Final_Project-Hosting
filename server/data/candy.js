const mongoCollections = require("../config/mongoCollections");
const CandyDataInfo = mongoCollections.CandyData;
const { ObjectId } = require('mongodb');

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

async function addNewRating(id, rating){
    if (!id) throw 'You must provide an id to search for';
    if (typeof(id) != 'string' || id.trim() === '') throw 'not a valid id';
    if (!ObjectId.isValid(id)) throw 'not a valid id';

    if(!rating) throw 'You must provide a rating';
    if(typeof(rating) !== 'number') throw 'rating must be a number';
    if (rating < 0 || rating > 5) throw 'rating must be between 0 and 5';
    
    id = ObjectId(id);

    const candyDataCollection = await CandyDataInfo();
    const search = await candyDataCollection.findOne({ _id: id });
    if (search === null) throw "no candy fit with this id";

    const newRating = (search.rating * search.numRatings + rating) / (search.numRatings + 1);

    const updatedCandy = {
        rating: newRating,
    };

    const updatedInfo = await movieCollection.updateOne(
        { _id: id },
        { $set: updatedCandy}
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update candy successfully';
    }

    return this.get(id.toString());
}

async function changeRating(id, rating, oldRating){
    if (!id) throw 'You must provide an id to search for';
    if (typeof(id) != 'string' || id.trim() === '') throw 'not a valid id';
    if (!ObjectId.isValid(id)) throw 'not a valid id';

    if(!rating) throw 'You must provide a rating';
    if(typeof(rating) !== 'number') throw 'rating must be a number';
    if (rating < 0 || rating > 5) throw 'rating must be between 0 and 5';

    if(!oldRating) throw 'You must provide a oldRating';
    if(typeof(oldRating) !== 'number') throw 'oldRating must be a number';
    if (oldRating < 0 || oldRating > 5) throw 'oldRating must be between 0 and 5';
    
    id = ObjectId(id);

    const candyDataCollection = await CandyDataInfo();
    const search = await candyDataCollection.findOne({ _id: id });
    if (search === null) throw "no candy fit with this id";

    const newRating = search.rating + ((rating - oldRating) / (search.numRatings));

    const updatedCandy = {
        rating: newRating,
    };

    const updatedInfo = await movieCollection.updateOne(
        { _id: id },
        { $set: updatedCandy}
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update candy successfully';
    }

    return this.get(id.toString());
}

module.exports = {
    getAll,
    getById,
    getByName,
    getByRating,
    addNewRating,
    changeRating
}
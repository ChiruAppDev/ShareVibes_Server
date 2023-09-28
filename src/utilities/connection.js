const { Schema } = require('mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// const url ="mongodb+srv://chiruvaradani123:chiru123@filmopediadb.jdaa3ea.mongodb.net/Filmopedia"
const url = "mongodb+srv://chiruvaradani123:chiruvaradani123@sharevibes.fx0uvsv.mongodb.net/ShareVibes"

const usersSchema = Schema({
    userName: { type: String,required: [true, 'name is required']},
    email: { type: String,required: [true, 'email is required']},
    password: { type: String,required: [true, 'pass is required']},
    mobile: { type: Number,required: [true, 'mobile is required']},
    dateOfBirth:{type: String},
    bio:{type: String},
    profileImage:{type: String},
    posts:{type:Array},
    friendsListArray:{type: Array},
    requestedListArray:{type: Array},
    savedPosts:{type: Array},
    sentRequest:{type: Array}
}, { collection: "users", timestamps: true })

const postsSchema = Schema({
    postId:{type:String},
    description:{type:String},
    imagePath:{type:String},
    imageUriPath:{type:String},
    postedOn:{type: String},
    location:{type: String},
    postedBy:{type:Object},
    likes:{type:Array},
    comments:{type:Array},
}, { collection: "posts", timestamps: true })



let connection = {}

//Returns model object of "Users" collection
connection.UserCollection = async () => {
    //Establish connection and return model as promise
    try {
        console.log("Connection to DB success");
        const database = await mongoose.connect(url, { useNewUrlParser: true });
        return database.model('users', usersSchema);
    } catch (error) {
        let err = new Error("Could not connect to the database");
        err.status = 500;
        throw err;
    }
}

//Returns model object of "posts" collection
connection.PostsCollection = async () => {
    //Establish connection and return model as promise
    try {
        console.log("Connection to DB success");
        const database = await mongoose.connect(url, { useNewUrlParser: true });
        return database.model('posts', postsSchema);
    } catch (error) {
        let err = new Error("Could not connect to the database");
        err.status = 500;
        throw err;
    }
}

module.exports = connection;

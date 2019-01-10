const mongoose = require("mongoose");
//Save a reference for schema construction
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    body: {
        type: String
    },
    saved:{
        type: Boolean,
        default: false
    },
    note : {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports= Article;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    title: String,
    body: String,
    new :{
        type: Boolean,
        default: true
    }
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
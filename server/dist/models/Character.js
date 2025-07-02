import { Schema, model } from 'mongoose';
// Define the schema for the Comment subdocument
const commentSchema = new Schema({
    commentText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
}, {
    _id: false,
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true,
});
// Define the schema for the Character document
const characterSchema = new Schema({
    characterData: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
        trim: true,
    },
    characterCreator: {
        type: String,
        required: true,
        trim: true,
    },
    comments: [commentSchema],
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
});
const Character = model('Character', characterSchema);
export default Character;

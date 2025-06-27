import { Schema, model } from 'mongoose';
//Publish Schema for document
const PublishSchema = new Schema({
    PublishText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
        trim: true,
    },
    PublishAuthor: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments: [
        {
            commentText: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    originalThoughtId: {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
        required: false,
    },
});
//create and update Publish
PublishSchema.statics.createFromThought = async function (thoughtId) {
    const Thought = model("Thought");
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
        throw new Error('Error! There is no thought that matches what ya looking for...');
    }
    //check if already published
    const existingPublish = await this.findOne({ originalThoughtId: thoughtId });
    if (existingPublish) {
        return this.findOneAndUpdate({ originalThoughtId: thoughtId }, {
            PublishText: thought.thoughtText,
            PublishAuthor: thought.thoughtAuthor,
            originalThoughtId: thought._id,
        }, { new: true });
    }
    else { //if doesn't exist, it will create a new one!
        return this.create({
            PublishText: thought.thoughtText,
            PublishAuthor: thought.thoughtAuthor,
            originalThoughtId: thought._id,
            comments: []
        });
    }
};
const Publish = model('Publish', PublishSchema);
export default Publish;

import { Schema, model, Document, Model } from 'mongoose';
//this is both model and schema in one file
//this is the only of of its kinds
//due to publishing part of it
//I thought it would be good to keep it all as one package
//Query will be normal though

//add remove later(that will be thing to do)
interface IComment extends Document {
    commentText: string;
    createdAt: Date;
}
//published interface
interface IPublish extends Document {
    PublishText: string;
    PublishAuthor: string;
    createdAt: Date;
    comments: IComment[];
    originalThoughtId?: Schema.Types.ObjectId;
}

//Publish Schema for document
const PublishSchema = new Schema<IPublish>({
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
PublishSchema.statics.createFromThought = async function (thoughtId: string) {
    const Thought = model("Thought");
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
        throw new Error('Error! There is no thought that matches what ya looking for...');
    }

    //check if already published
    const existingPublish = await this.findOne({ originalThoughtId: thoughtId });

    if (existingPublish) {
        return this.findOneAndUpdate(
            { originalThoughtId: thoughtId }, {

            PublishText: thought.thoughtText,
            PublishAuthor: thought.thoughtAuthor,
            originalThoughtId: thought._id,

        },
            { new: true }
        )
    } else { //if doesn't exist, it will create a new one!
        return this.create({
            PublishText: thought.thoughtText,
            PublishAuthor: thought.thoughtAuthor,
            originalThoughtId: thought._id,
            comments: []
        })

    }
}

interface IPublishModel extends Model<IPublish> {
    createFromThought(thoughtId: string): Promise<IPublish>;
}

const Publish = model<IPublish, IPublishModel>('Publish', PublishSchema);

export default Publish;

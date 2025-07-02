import { Schema, model, Document } from 'mongoose';

// Define an interface for the Character document
interface IComment extends Document {
  commentText: string;
  createdAt: Date;
}

interface ICharacter extends Document {
  characterData: string;
  characterCreator: string;
  createdAt: Date;
  comments: IComment[];
}

// Define the schema for the Comment subdocument
const commentSchema = new Schema<IComment>(
  {
    commentText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
  },
  {
    _id: false,
    toJSON: { getters: true },
    toObject: { getters: true },
    timestamps: true,
  }
);

// Define the schema for the Character document
const characterSchema = new Schema<ICharacter>(
  {
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
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const Character = model<ICharacter>('Character', characterSchema);

export default Character;
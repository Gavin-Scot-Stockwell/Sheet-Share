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
    originalCharacterId: {
        type: Schema.Types.ObjectId,
        ref: 'Character',
        required: false,
    },
});
//create and update Publish
PublishSchema.statics.createFromCharacter = async function (characterId) {
    const Character = model("Character");
    const character = await Character.findById(characterId);
    if (!character) {
        throw new Error('Error! There is no character that matches what ya looking for...');
    }
    //check if already published
    const existingPublish = await this.findOne({ originalCharacterId: characterId });
    if (existingPublish) {
        return this.findOneAndUpdate({ originalCharacterId: characterId }, {
            PublishText: character.characterData,
            PublishAuthor: character.characterCreator,
            originalCharacterId: character._id,
        }, { new: true });
    }
    else { //if doesn't exist, it will create a new one!
        return this.create({
            PublishText: character.characterData,
            PublishAuthor: character.characterCreator,
            originalCharacterId: character._id,
            comments: []
        });
    }
};
const Publish = model('Publish', PublishSchema);
export default Publish;

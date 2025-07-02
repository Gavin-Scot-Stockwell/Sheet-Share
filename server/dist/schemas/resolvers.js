import { Character, User, Publish } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('characters');
        },
        user: async (_parent, { username }) => {
            return User.findOne({ username }).populate('characters');
        },
        characters: async () => {
            return await Character.find().sort({ createdAt: -1 });
        },
        character: async (_parent, { characterId }) => {
            return await Character.findOne({ _id: characterId });
        },
        publish: async (_parent, { publishId }) => {
            return await Publish.findOne({ _id: publishId });
        },
        publishes: async () => {
            return await Publish.find().sort({ createdAt: -1 });
        },
        me: async (_parent, _args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('characters');
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent, { input }) => {
            const user = await User.create({ ...input });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        login: async (_parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        addCharacter: async (_parent, { input }, context) => {
            if (context.user) {
                const character = await Character.create({ ...input });
                await User.findOneAndUpdate({ _id: context.user._id }, { $addToSet: { characters: character._id } });
                return character;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        addComment: async (_parent, { characterId, commentText }, context) => {
            if (context.user) {
                return Character.findOneAndUpdate({ _id: characterId }, {
                    $addToSet: {
                        comments: { commentText, commentAuthor: context.user.username },
                    },
                }, {
                    new: true,
                    runValidators: true,
                });
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeCharacter: async (_parent, { characterId }, context) => {
            if (context.user) {
                const character = await Character.findOneAndDelete({
                    _id: characterId,
                    characterCreator: context.user.username,
                });
                if (!character) {
                    throw new AuthenticationError('Character not found or not authorized');
                }
                await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { characters: character._id } });
                return character;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeComment: async (_parent, { characterId, commentId }, context) => {
            if (context.user) {
                return Character.findOneAndUpdate({ _id: characterId }, {
                    $pull: {
                        comments: {
                            _id: commentId,
                            commentAuthor: context.user.username,
                        },
                    },
                }, { new: true });
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removePublish: async (_parent, { publishId }, context) => {
            if (context.user) {
                const publish = await Publish.findOneAndDelete({
                    _id: publishId,
                    PublishAuthor: context.user.username,
                });
                if (!publish) {
                    throw new AuthenticationError('Publish not found or not authorized');
                }
                return publish;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        updateCharacter: async (_parent, { characterId, input }, context) => {
            if (context.user) {
                const character = await Character.findOneAndUpdate({
                    _id: characterId,
                    characterCreator: context.user.username,
                }, { ...input }, { new: true, runValidators: true });
                if (!character) {
                    throw new AuthenticationError('Character not found or not authorized');
                }
                return character;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        publishCharacter: async (_parent, { characterId }, context) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }
            return await Publish.createFromCharacter(characterId);
        },
    },
};
export default resolvers;

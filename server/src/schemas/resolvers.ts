import { Character, User, Publish } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

// Define types for the arguments
interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface CharacterArgs {
  characterId: string;
}

interface AddCharacterArgs {
  input: {
    characterData: string;
    characterCreator: string;
  }
}

interface AddCommentArgs {
  characterId: string;
  commentText: string;
}

interface RemoveCommentArgs {
  characterId: string;
  commentId: string;
}

interface UpdateCharacterArgs {
  characterId: string;
  input: {
    characterData: string;
  }
}

interface PublishArgs {
  publishId: string;
}

interface RemovePublishArgs {
  publishId: string;
}

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('characters');
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate('characters');
    },
    characters: async () => {
      return await Character.find().sort({ createdAt: -1 });
    },
    character: async (_parent: any, { characterId }: CharacterArgs) => {
      return await Character.findOne({ _id: characterId });
    },
    publish: async (_parent: any, { publishId }: PublishArgs) => {
      return await Publish.findOne({ _id: publishId });
    },
    publishes: async () => {
      return await Publish.find().sort({ createdAt: -1 });
    },

    me: async (_parent: any, _args: any, context: any) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('characters');
      }
      throw new AuthenticationError('Could not authenticate user.');
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      const user = await User.create({ ...input });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    login: async (_parent: any, { email, password }: LoginUserArgs) => {
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

    addCharacter: async (_parent: any, { input }: AddCharacterArgs, context: any) => {
      if (context.user) {
        const character = await Character.create({ ...input });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { characters: character._id } }
        );

        return character;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    addComment: async (_parent: any, { characterId, commentText }: AddCommentArgs, context: any) => {
      if (context.user) {
        return Character.findOneAndUpdate(
          { _id: characterId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removeCharacter: async (_parent: any, { characterId }: CharacterArgs, context: any) => {
      if (context.user) {
        const character = await Character.findOneAndDelete({
          _id: characterId,
          characterCreator: context.user.username,
        });

        if (!character) {
          throw new AuthenticationError('Character not found or not authorized');
        }

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { characters: character._id } }
        );

        return character;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removeComment: async (_parent: any, { characterId, commentId }: RemoveCommentArgs, context: any) => {
      if (context.user) {
        return Character.findOneAndUpdate(
          { _id: characterId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removePublish: async (_parent: any, { publishId }: RemovePublishArgs, context: any) => {
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

    updateCharacter: async (_parent: any, { characterId, input }: UpdateCharacterArgs, context: any) => {
      if (context.user) {
        const character = await Character.findOneAndUpdate(
          {
            _id: characterId,
            characterCreator: context.user.username,
          },
          { ...input },
          { new: true, runValidators: true }
        );

        if (!character) {
          throw new AuthenticationError('Character not found or not authorized');
        }

        return character;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    publishCharacter: async (_parent: any, { characterId }: CharacterArgs, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      return await Publish.createFromCharacter(characterId);
    },
  },
};

export default resolvers;
import { Thought, User, Publish } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
//update thought
//add publish
//publish allows others to see it
//when the publish/share button is pressed
//for the first time it will save a new document
//during the second time being pressed it will update that same public document

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

interface ThoughtArgs {
  thoughtId: string;
}

interface AddThoughtArgs {
  input: {
    thoughtText: string;
    thoughtAuthor: string;
  }
}

interface AddCommentArgs {
  thoughtId: string;
  commentText: string;
}

interface RemoveCommentArgs {
  thoughtId: string;
  commentId: string;
}

interface UpdateThoughtArgs {
  thoughtId: string;

  input: {
    thoughtText: string;
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
      return User.find().populate('thoughts');
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate('thoughts');
    },
    thoughts: async () => {
      return await Thought.find().sort({ createdAt: -1 });
    },
    thought: async (_parent: any, { thoughtId }: ThoughtArgs) => {
      return await Thought.findOne({ _id: thoughtId });
    },
    publish: async (_parent: any, { publishId }: PublishArgs) => {
      return await Publish.findOne({ _id: publishId });
    },
    publishes: async () => {
      return await Publish.find().sort({ createdAt: -1 });
    },

    // Query to get the authenticated user's information
    // The 'me' query relies on the context to check if the user is authenticated
    me: async (_parent: any, _args: any, context: any) => {
      // If the user is authenticated, find and return the user's information along with their thoughts
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('thoughts');
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError('Could not authenticate user.');
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // Create a new user with the provided username, email, and password
      const user = await User.create({ ...input });

      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);

      // Return the token and the user
      return { token, user };
    },

    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });

      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);

      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }

      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);

      // Return the token and the user
      return { token, user };
    },
    addThought: async (_parent: any, { input }: AddThoughtArgs, context: any) => {
      if (context.user) {
        const thought = await Thought.create({ ...input });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { thoughts: thought._id } }
        );

        return thought;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    addComment: async (_parent: any, { thoughtId, commentText }: AddCommentArgs, context: any) => {
      if (context.user) {
        return Thought.findOneAndUpdate(
          { _id: thoughtId },
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

    removeThought: async (_parent: any, { thoughtId }: ThoughtArgs, context: any) => {
      if (context.user) {
        const thought = await Thought.findOneAndDelete({
          _id: thoughtId,
          thoughtAuthor: context.user.username,
        });

        if (!thought) {
          throw new AuthenticationError('Thought not found or not authorized');
        }

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { thoughts: thought._id } }
        );

        return thought;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removeComment: async (_parent: any, { thoughtId, commentId }: RemoveCommentArgs, context: any) => {
      if (context.user) {
        return Thought.findOneAndUpdate(
          { _id: thoughtId },
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

    updateThought: async (_parent: any, { thoughtId, input }: UpdateThoughtArgs, context: any) => {
      if (context.user) {
        const thought = await Thought.findOneAndUpdate(
          {
            _id: thoughtId,
            thoughtAuthor: context.user.username,
          },
          { ...input },
          { new: true, runValidators: true }
        );

        if (!thought) {
          throw new AuthenticationError('Thought not found or not authorized');
        }

        return thought;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    //the resolver stuff in model
    publishThought: async (_parent: any, { thoughtId }: ThoughtArgs, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      return await Publish.createFromThought(thoughtId);
    },
  },
};
export default resolvers;

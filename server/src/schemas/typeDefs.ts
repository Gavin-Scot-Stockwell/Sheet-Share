const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    characters: [Character]!
  }

  type Character {
    _id: ID
    characterData: String
    characterCreator: String
    createdAt: String
    comments: [Comment]!
  }

  type Publish {
  _id: ID
  PublishText: String
  PublishAuthor: String
  createdAt: String
  comments: [Comment]!
  originalCharacterId: ID
  }

  type Comment {
    _id: ID
    commentText: String
    createdAt: String
  }

  input CharacterInput {
    characterData: String!
    characterCreator: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
  
  input UpdateCharacterInput {
    characterData: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    characters: [Character]!
    character(characterId: ID!): Character
    publishes: [Publish]!
    publish(publishId: ID!): Publish
    me: User
  }

 type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addCharacter(input: CharacterInput!): Character
    addComment(characterId: ID!, commentText: String!): Character
    removeCharacter(characterId: ID!): Character
    removeComment(characterId: ID!, commentId: ID!): Character
    removePublish(publishId: ID!): Publish
    updateCharacter(characterId: ID!, input: UpdateCharacterInput!): Character
    publishCharacter(characterId: ID!): Publish
  }
`;

export default typeDefs;
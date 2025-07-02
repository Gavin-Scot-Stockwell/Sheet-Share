import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation($input: UserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
  }
}
`;

export const ADD_CHARACTER = gql`
  mutation AddCharacter($input: CharacterInput!) {
    addCharacter(input: $input) {
      _id
      characterData
      characterCreator
      createdAt
      comments {
        _id
        commentText
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($characterId: ID!, $commentText: String!) {
    addComment(characterId: $characterId, commentText: $commentText) {
      _id
      characterData
      characterCreator
      createdAt
      comments {
        _id
        commentText
        createdAt
      }
    }
  }
`;

export const ADD_PUBLISH = gql`
mutation PublishCreate($characterId: ID!) {
  publishCharacter(characterId: $characterId) {
    PublishText
    _id
    originalCharacterId
  }
}
`;

export const UPDATE_CHARACTER = gql`
mutation updateCharacter($characterId: ID!, $input: UpdateCharacterInput!) {
  updateCharacter(characterId: $characterId, input: $input) {
    _id
    characterData
  }
}
`;

export const REMOVE_CHARACTER = gql`
mutation RemoveCharacter($characterId: ID!) {
  removeCharacter(characterId: $characterId) {
    _id
  }
}
`;
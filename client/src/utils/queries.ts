import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      characters {
        _id
        characterData
        createdAt
      }
    }
  }
`;

export const QUERY_CHARACTERS = gql`
  query getCharacters {
    characters {
      _id
      characterData
      characterCreator
      createdAt
    }
  }
`;

export const QUERY_SINGLE_CHARACTER = gql`
  query getSingleCharacter($characterId: ID!) {
    character(characterId: $characterId) {
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

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      characters {
        _id
        characterData
        characterCreator
        createdAt
      }
    }
  }
`;

export const GET_PUBLISH = gql`
query Publish($publishId: ID!) {
  publish(publishId: $publishId) {
    PublishText
    _id
    originalCharacterId
  }
}
`;

export const GET_PUBLISHES = gql`
query getPublishes {
  publishes {
    PublishText
    PublishAuthor
    originalCharacterId
    _id
  }
}
`;
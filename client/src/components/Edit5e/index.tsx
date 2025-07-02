import { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { UPDATE_CHARACTER } from '../../utils/mutations';
import { QUERY_CHARACTERS, QUERY_ME, QUERY_SINGLE_CHARACTER } from '../../utils/queries';

import Auth from '../../utils/auth';

const CharacterForm = () => {
  const [characterData, setCharacterData] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  //get id
  const {characterId} = useParams<{characterId:string}>();
  //get existing character
  const {data: characterDataQuery, loading } = useQuery(QUERY_SINGLE_CHARACTER, {
    variables: {characterId},
    skip: !characterId,
  });

  //debugging characters
  console.log('Query debugging:');
  console.log('characterId:', characterId);
  console.log('characterData:', characterDataQuery);
  console.log('loading:', loading);

  //load in the data into the form to edit
  useEffect(()=> {
    console.log("useEffect Trigger");
    console.log("characterData:", characterDataQuery);

    if(characterDataQuery?.character){
      console.log("set characterData", characterDataQuery.character.characterData);
      setCharacterData(characterDataQuery.character.characterData);
      setCharacterCount(characterDataQuery.character.characterData.length);
    }
  },[characterDataQuery]);

  const [updateCharacter, { error }] = useMutation(UPDATE_CHARACTER, {
    refetchQueries: [
      QUERY_CHARACTERS,
      'getCharacters',
      QUERY_ME,
      'me'
    ]
  });

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await updateCharacter({
        variables: { 
          characterId,
          input:{
            characterData,
          }},
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    if (name === 'characterData' && value.length <= 280) {
      setCharacterData(value);
      setCharacterCount(value.length);
    }
  };

  return (
    <div>
      <h3>Edit Your Character</h3>

      {loading && <p>Loading character...</p>}

      {Auth.loggedIn() ? (
        <>
          <p
            className={`m-0 ${
              characterCount === 280 || error ? 'text-danger' : ''
            }`}
          >
            Character Count: {characterCount}/280
          </p>
          <form
            className="flex-row justify-center justify-space-between-md align-center"
            onSubmit={handleFormSubmit}
          >
            <div className="col-12 col-lg-9">
              <textarea
                name="characterData"
                placeholder="Edit your character details..."
                value={characterData}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Update Character
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3">
                {error.message}
              </div>
            )}
          </form>
        </>
      ) : (
        <p>
          You need to be logged in to edit characters. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default CharacterForm;
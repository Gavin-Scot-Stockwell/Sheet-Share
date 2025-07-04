import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { ADD_CHARACTER } from '../../utils/mutations';
import { QUERY_CHARACTERS, QUERY_ME } from '../../utils/queries';

import Auth from '../../utils/auth';

const CharacterForm = () => {
  const [characterData, setCharacterData] = useState('');

  const [characterCount, setCharacterCount] = useState(0);

  const [addCharacter, { error }] = useMutation
  (ADD_CHARACTER, {
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
      await addCharacter({
        variables: { input:{
          characterData,
          characterCreator: Auth.getProfile().data.username,
        }},
      });

      setCharacterData('');
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
      <h3>Create Your D&D 5e Character</h3>

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
                placeholder="Describe your character..."
                value={characterData}
                className="form-input w-100"
                style={{ lineHeight: '1.5', resize: 'vertical' }}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-12 col-lg-3">
              <button className="btn btn-primary btn-block py-3" type="submit">
                Create Character
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
          You need to be logged in to create characters. Please{' '}
          <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
        </p>
      )}
    </div>
  );
};

export default CharacterForm;
// Import `<Link>` component from React Router for internal hyperlinks
import { Link } from 'react-router-dom';
import { REMOVE_CHARACTER } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import { QUERY_CHARACTERS, QUERY_ME } from '../../utils/queries';

interface Character {
  _id: string;
  characterCreator: string;
  createdAt: string;
  characterData: string;
}

interface CharacterListProps {
  characters: Character[];
  title: string;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, title }) => {
  if (!characters.length) {
    return <h3>No Characters Yet</h3>;
  }

  //handles remove mutation
  const [removeCharacter, { error }] = useMutation(REMOVE_CHARACTER, {
    refetchQueries: [
      QUERY_CHARACTERS,
      'getCharacters',
      QUERY_ME,
      'me'
    ]
  });

  const handleRemoveClick = async (characterId: string) => {
    if(window.confirm("Are you sure you want to delete this character?")){
      try{
        await removeCharacter({
          variables: { characterId }
        });
      } catch (err) {
        console.log("Error when removing D&D 5e character: ", err);
      }
    }
  }

  return (
    <div>
      <h3>{title}</h3>
      {characters &&
        characters.map((character) => (
          <div key={character._id} className="card mb-3">
            <h4 className="card-header bg-primary text-light p-2 m-0">
              {character.characterCreator} <br />
              <span style={{ fontSize: '1rem' }}>
                created this character on {new Date(Number(character.createdAt)).toLocaleString()}
              </span>
            </h4>
            <div className="card-body bg-light p-2">
              <p>{character.characterData}</p>
            </div>
            
            <div className="d-flex gap-2 p-2">
              <Link
                className="btn btn-primary btn-squared flex-fill"
                to={`/edit5e/${character._id}`}
              >
                Edit and Play
              </Link>
              <button
                className="btn btn-danger btn-squared flex-fill"
                onClick={() => handleRemoveClick(character._id)}  
              >
                Remove Character?
              </button>
            </div>
            
            {error && (
              <div className="alert alert-danger mt-2">
                Error when removing D&D 5e character: {error.message}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default CharacterList;
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import CommentList from '../components/CommentList/index.tsx';
import CommentForm from '../components/CommentForm/index.tsx';

import { QUERY_SINGLE_CHARACTER } from '../utils/queries.ts';

const SingleCharacter = () => {
  const { characterId } = useParams();

  const { loading, data } = useQuery(QUERY_SINGLE_CHARACTER, {
    variables: { characterId: characterId },
  });

  const character = data?.character || {};

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="my-3">
      <h3 className="card-header bg-dark text-light p-2 m-0">
        {character.characterCreator} <br />
        <span style={{ fontSize: '1rem' }}>
          created this character on {new Date(Number(character.createdAt)).toLocaleString()}
        </span>
      </h3>
      <div className="bg-light py-4">
        <blockquote
          className="p-4"
          style={{
            fontSize: '1.5rem',
            fontStyle: 'italic',
            border: '2px dotted #1a1a1a',
            lineHeight: '1.5',
          }}
        >
          {character.characterData}
        </blockquote>
      </div>

      <div className="my-5">
        <CommentList comments={character.comments} />
      </div>
      <div className="m-3 p-4" style={{ border: '1px dotted #1a1a1a' }}>
        <CommentForm characterId={character._id} />
      </div>
    </div>
  );
};

export default SingleCharacter;
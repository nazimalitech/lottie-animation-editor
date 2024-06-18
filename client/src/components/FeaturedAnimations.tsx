import React from 'react';
import { useQuery, gql } from '@apollo/client';
import client from '../apolloClient';

const GET_FEATURED_ANIMATIONS = gql`
  query GetFeaturedAnimations {
    featuredAnimations {
      id
      title
      preview_url
    }
  }
`;

interface FeaturedAnimationsProps {
  onImport: (animationUrl: string) => void;
}

const FeaturedAnimations: React.FC<FeaturedAnimationsProps> = ({ onImport }) => {
  const { loading, error, data } = useQuery(GET_FEATURED_ANIMATIONS, { client });

  return (
    <div>
      <h3>Featured Animations</h3>
      {loading && <p>Loading...</p>}
      {error && <p>Error fetching featured animations.</p>}
      {data && (
        <div className="featured-animations">
          {data.featuredAnimations.map((animation: any) => (
            <div key={animation.id} className="featured-animation">
              <h4>{animation.title}</h4>
              <button onClick={() => onImport(animation.preview_url)}>
                Import
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedAnimations;

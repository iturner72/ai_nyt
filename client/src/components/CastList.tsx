import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Cast {
  data: {
    castAddBody: {
      embeds: any[];
      embedsDeprecated: any[];
      mentions: number[];
      mentionsPositions: number[];
      parentCastId?: {
        fid: number;
        hash: string;
      };
      text?: string;
    };
    fid: number;
    network: string;
    timestamp: number;
    type: string;
  };
  hash: string;
}

const CastList: React.FC = () => {
    const [casts, setCasts] = useState<Cast[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCasts = async () => {
            try {
                const fid = 249222
                const response = await axios.get(`http://127.0.0.1:8080/castsByFid/${fid}`);

                setCasts(response.data.messages);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch casts. Please try again.');
                setLoading(false);
            }
        };

        fetchCasts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
      <div>
        <h2>Casts</h2>
        {casts.map((cast) => (
          <div key={cast.hash}>
            <p>Author FID: {cast.data.fid}</p>
            {cast.data.castAddBody && (
              <>
                {cast.data.castAddBody.text && (
                  <p>Text: {cast.data.castAddBody.text}</p>
                )}
                {cast.data.castAddBody.parentCastId && (
                  <p>Parent Cast ID: {cast.data.castAddBody.parentCastId.hash}</p>
                )}
              </>
            )}
            <p>Timestamp: {new Date(cast.data.timestamp * 1000).toLocaleString()}</p>
            {/* Add more properties as needed */}
          </div>
        ))}
      </div>
    );



};

export default CastList;

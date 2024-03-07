import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Cast {
    fid: number;
    hash: string;    
    parent_hash: string | null;
    author_fid: number;
    timestamp: number;
    text: string;
    mentions: number[];
    mentions_position: number[];
    embeds: Embed[];
}

interface Embed {
    url?: string;
    cast_id?: CastId;
}

interface CastId {
    fid: number;
    hash: string;
}

const CastList: React.FC = () => {
    const [casts, setCasts] = useState<Cast[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCasts = async () => {
            try {
                const fid = 2;
                const response = await axios.get(`http://localhost:2281/castsByFid/${fid}`);
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
            <p>Author FID: {cast.author_fid}</p>
            <p>Text: {cast.text}</p>
            <p>Timestamp: {new Date(cast.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    );
};

export default CastList;

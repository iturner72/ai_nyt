import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Cast {
  data: {
    castAddBody?: {
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

const fids = [249222, 5650, 37, 97, 151, 318610]

const CastList: React.FC = () => {
    const [castsByFid, setCastsByFid] = useState<Cast[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string>('');

    useEffect(() => {
        const fetchCasts = async () => {
            setLoading(true)
            try {
                const castPromises = fids.map(fid =>
                    axios.get(`http://127.0.0.1:8080/castsByFid/${fid}`).then(res => res.data.messages)
                );
                const castsResults = await Promise.all(castPromises);
                setCastsByFid(castsResults);
            } catch (error) {
                setError('Failed to fetch casts. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCasts();
    }, []);

    const submitTextForSummary = async () => {

        // Find the newest cast's timestamp
        const newestTimestamp = castsByFid.flat().reduce((newest, cast) => {
            const castTimestamp = new Date(cast.data.timestamp * 1000);
            return castTimestamp > newest ? castTimestamp : newest;
        }, new Date(0));

        // Filter casts from the last 24 hours
        const oneDayAgo = new Date(newestTimestamp.getTime() - (24 * 60 * 60 * 1000));
        const recentCastsTexts = castsByFid.flat().filter(cast => {
            const castTimestamp = new Date(cast.data.timestamp * 1000);
            return castTimestamp >= oneDayAgo;
        }).map(cast => cast.data.castAddBody?.text || '').filter(text => text);

        // Concatenate the texts of all casts
        const concatenatedText = recentCastsTexts.join(' ');
    
        try {
            const response = await axios.post('http://127.0.0.1:8080/generate_daily_summary', { text: concatenatedText });
            if (response.status === 200 && response.data) {
                setSummary(response.data.summary); // Assuming the backend response includes a "summary" field
                console.log('Summary generated:', response.data.summary);
            } else {
                console.error('Failed to generate summary:', response.status);
            }
        } catch (error) {
            console.error("Error submitting text for summary:", error);
            setError('Failed to submit text for summary. Please try again.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;


    return (
      <div className="flex flex-row items-start">
        <button onClick={submitTextForSummary}>Generate Summary from Casts</button>
        {summary && (
          <div>
            <h2>Daily Summary</h2>
            <p>{summary}</p>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          {castsByFid.map((casts, index) => (
            <div key={fids[index]} style={{ maxWidth: '20%' }}>
              <h2>FID: {fids[index]}</h2>
              {casts.map(cast => (
                <div key={cast.hash} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                  {cast.data.castAddBody?.text ? <p>{cast.data.castAddBody.text}</p> : <p>No text content</p>}
                  <p>Timestamp: {new Date(cast.data.timestamp * 1000).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
};

export default CastList;

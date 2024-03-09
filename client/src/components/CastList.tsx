import React, {useEffect, useState} from 'react';
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

const channels = ['https://warpcast.com/~/channel/onthebrink', 'https://warpcast.com/~/channel/gray']
const fids = [249222, 5650, 37, 97, 151, 318610, 319431]
// Ian, Vitalik, Balaji, Nic, Matt, Solana, Ryan

const CastList: React.FC = () => {
    const [castsByFid, setCastsByFid] = useState<Cast[][]>([]);
    const [castsByChannel, setCastsByChannel] = useState<Cast[][]>([]);
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

    useEffect(() => {
        const fetchChannelCasts = async () => {
            setLoading(true)
            try {
                console.log('Fetching casts by channel');
                const channelPromises = channels.map(channel =>
                    axios.get(`http://127.0.0.1:8080/castsByChannel/${encodeURIComponent(channel)}`).then(res => {
                        console.log(`Fetched casts for chennel ${channel}:`, res.data.messages);
                        return res.data.messages;
                    })
                );
                const channelCastsResults = await Promise.all(channelPromises);
                setCastsByChannel(channelCastsResults);
            } catch (error) {
                setError('Failed to fetch channel casts. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchChannelCasts();
    }, []);


    const submitTextForSummary = async () => {

        // Find the newest cast's timestamp
        const newestTimestamp = castsByFid.flat().reduce((newest, cast) => {
            const castTimestamp = new Date(cast.data.timestamp * 1000);
            return castTimestamp > newest ? castTimestamp : newest;
        }, new Date(0));

        // Filter casts from the last 24 hours
        const oneDayAgo = new Date(newestTimestamp.getTime() - (14 * 24 * 60 * 60 * 1000));
        const recentCastsTexts = castsByFid.flat().filter(cast => {
            const castTimestamp = new Date(cast.data.timestamp * 1000);
            return castTimestamp >= oneDayAgo;
        }).map(cast => cast.data.castAddBody?.text || '').filter(text => text);

        // Concatenate the texts of all casts
        const concatenatedText = recentCastsTexts.join(' ');

        try {
            const response = await axios.post('http://127.0.0.1:8080/generate_daily_summary', {text: concatenatedText});
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
        <div>
          {castsByChannel.map((casts, index) => (
            <div key={index}>
              <h3>Channel {index + 1}</h3>
              {casts.map(cast => (
                <div key={cast.hash}>
                  <p>{cast.data.castAddBody?.text}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
            <div className={'flex flex-col w-full gap-2 '}>
                {castsByFid.map((casts, index) => (
                    <div key={fids[index]} className={'max-w-3xl divide-y divide-slate-400'}>
                        <h2>FID: {fids[index]}</h2>
                        {casts.map(cast => (
                            <div key={cast.hash} className={'h-64 flex justify-between  overflow-hidden p-4 my-2'}>
                                <div className={'min-w-[400px] text-left '}>
                                    {cast.data.castAddBody?.text ? <p>{cast.data.castAddBody.text}</p> :
                                        <p>No text content</p>}
                                    <p>Timestamp: {new Date(cast.data.timestamp * 1000).toLocaleString()}</p>
                                </div>
                                <div className={'w-full'}>
                                    {cast.data.castAddBody?.embeds.map(embed => (
                                        <img key={embed.url} src={embed.url} alt={embed.url} className={'w-full h-full object-cover'}/>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CastList;

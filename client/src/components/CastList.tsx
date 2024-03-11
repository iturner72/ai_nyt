import React, {useEffect, useState} from 'react';
import CastEntry from './Cast';
import axios from 'axios';
import config from './../config';

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

interface CastListProps {
  channel: string;
}

const CastList = ({channel}: CastListProps) => {
  const [castsByFid, setCastsByFid] = useState<Cast[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>('');
  const hubble_url = process.env.HUBBLE_URL;

  // useEffect(() => {
  //     const fetchCasts = async () => {
  //         setLoading(true)
  //         try {
  //             const castPromises = fids.map(fid =>
  //                 axios.get(`http://127.0.0.1:8080/castsByFid/${fid}`).then(res => res.data.messages)
  //             );
  //             const castsResults = await Promise.all(castPromises);
  //             setCastsByFid(castsResults);
  //         } catch (error) {
  //             setError('Failed to fetch casts. Please try again.');
  //         } finally {
  //             setLoading(false);
  //         }
  //     };
  //
  //     fetchCasts();
  // }, []);

  useEffect(() => {
    const fetchChannelCasts = async () => {
      setLoading(true)
      try {
        console.log('Fetching casts by channel');


        axios.get(`https://${config.serverBaseUrl}/castsByChannel/${encodeURIComponent(channel)}`).then(res => {

          // axios.get(`${BACKEND_URL}/hubble/castsByChannel?channel_url=${encodeURIComponent(channel)}`).then(res => {

          console.log(`Fetched casts for chennel ${channel}:`, res.data.messages);
          setCasts(res.data.messages);
        })

      } catch (error) {
        setError('Failed to fetch channel casts. Please try again.');
      } finally {
        setLoading(false);
      }
      // Find the newest cast's timestamp
      const newestTimestamp = castsByFid.flat().reduce((newest, cast) => {
        const castTimestamp = new Date(cast.data.timestamp * 1000);
        return castTimestamp > newest ? castTimestamp : newest;
      }, new Date(0));

      // Filter casts from the last 24 hours
      const oneDayAgo = new Date(newestTimestamp.getTime() - (7 * 24 * 60 * 60 * 1000));
      const recentCastsTexts = castsByFid.flat().filter(cast => {
        const castTimestamp = new Date(cast.data.timestamp * 1000);
        return castTimestamp >= oneDayAgo;
      }).map(cast => cast.data.castAddBody?.text || '').filter(text => text);

      // Concatenate the texts of all casts
      const concatenatedText = recentCastsTexts.join(' ');

      try {
        const response = await axios.post(`https://${config.serverBaseUrl}/generate_daily_summary`, {text: concatenatedText});
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

    fetchChannelCasts();
  }, [channel]);


  const submitTextForSummary = async () => {

    // Find the newest cast's timestamp
    try {
      const newestTimestamp = casts.flat().reduce((newest, cast) => {
        const castTimestamp = new Date(cast.data.timestamp * 1000);
        return castTimestamp > newest ? castTimestamp : newest;
      }, new Date(0));

      // Filter casts from the last 24 hours
      const oneDayAgo = new Date(newestTimestamp.getTime() - (14 * 24 * 60 * 60 * 1000));
      const recentCastsTexts = casts.flat().filter(cast => {
        const castTimestamp = new Date(cast.data.timestamp * 1000);
        return castTimestamp >= oneDayAgo;
      }).map(cast => cast.data.castAddBody?.text || '').filter(text => text);

      // Concatenate the texts of all casts
      const concatenatedText = recentCastsTexts.join(' ');

      try {
        const response = await axios.post(`https://${config.serverBaseUrl}/generate_daily_summary`, {text: concatenatedText});
        // const response = await axios.post('http://127.0.0.1:8080/generate_daily_summary', {text: concatenatedText});
        if (response.status === 200 && response.data) {
          setSummary(response.data); // Assuming the backend response includes a "summary" field
          console.log('Summary generated:', response.data);
        } else {
          console.error('Failed to generate.ts summary:', response.status);
        }
      } catch (error) {
        console.error("Error submitting text for summary:", error);
        setError('Failed to submit text for summary. Please try again.');
      }
    } catch (error) {
      console.error("Error submitting text for summary:", error);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;


  return (
    <>
      <button className={''} onClick={submitTextForSummary}>Generate Summary from Casts</button>
      <div className=" max-w-[1400px] mx-auto py-10">
        {summary && (
          <article className={'text-left text-2xl font-serif leading-10 mx-48 py-20'}>
            <div
              className={' h-fit text-end inline-block text-[130px] float-left mt-12 pr-2 font-display'}>{summary.split('').splice(0, 1)}</div>
            <p className={'clear-right'}>{summary.split('').slice(1)}</p>
          </article>
        )}
        <div className={'grid grid-cols-3 gap-5 w-full'}>
          {casts.map((cast, index) => (
            <CastEntry cast={cast} index={index} key={index}/>
          ))}
        </div>
      </div>
    </>
  );

}
export default CastList;

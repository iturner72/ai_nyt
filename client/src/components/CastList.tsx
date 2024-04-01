import React, { useEffect, useState } from 'react';
import CastEntry from './Cast';
import axios from 'axios';
import config2 from './../config2';

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
  searchUsername: string;
}

const CastList = ({ channel, searchUsername }: CastListProps) => {
  const [allCasts, setAllCasts] = useState<Cast[]>([]);
  const [displayCasts, setDisplayCasts] = useState<Cast[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [castsByFid, setCastsByFid] = useState<Cast[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const channelName = channel.split('/').pop();

  useEffect(() => {
    const fetchChannelCasts = async () => {
      setLoading(true);
      try {
        console.log('Fetching casts by channel');

        const response = await axios.get(`https://${config2.serverBaseUrl}/castsByChannel/${encodeURIComponent(channel)}`);
        const fetchedCasts = response.data.messages;

        const sortedCasts = fetchedCasts.sort((a: any, b: any) => b.data.timestamp - a.data.timestamp);

        console.log(`Fetched casts for channel ${channel}:`, sortedCasts);
        setAllCasts(sortedCasts);
        setDisplayCasts(sortedCasts.slice(0, 120));
      } catch (error) {
        setError('Failed to fetch channel casts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChannelCasts();
  }, [channel, page]);

  const updateDisplayedCasts = (newStartIndex: number) => {
      setStartIndex(newStartIndex);
      setDisplayCasts(allCasts.slice(newStartIndex, newStartIndex + 40));
  };

  useEffect(() => {
    setStartIndex(0);
    setDisplayCasts(allCasts.slice(0, 40));
  }, [allCasts]);

  const submitTextForSummary = async () => {
    // Find the newest cast's timestamp
    try {
      const newestTimestamp = casts.reduce((newest, cast) => {
        const castTimestamp = new Date(cast.data.timestamp * 1000);
        return castTimestamp > newest ? castTimestamp : newest;
      }, new Date(0));

      // Filter casts from the last 14 days
      const sevenDaysAgo = new Date(newestTimestamp.getTime() - (7 * 24 * 60 * 60 * 1000));
      const recentCastsTexts = casts.filter(cast => {
        const castTimestamp = new Date(cast.data.timestamp * 1000);
        return castTimestamp >= sevenDaysAgo;
      }).map(cast => cast.data.castAddBody?.text || '').filter(text => text);

      // Concatenate the texts of all casts
      const concatenatedText = recentCastsTexts.join(' ');

      try {
        const response = await axios.post(`https://${config2.serverBaseUrl}/generate_daily_summary`, { text: concatenatedText });
        if (response.status === 200 && response.data) {
          setSummary(response.data);
          console.log('Summary generated:', response.data);
        } else {
          console.error('Failed to generate summary:', response.status);
        }
      } catch (error) {
        console.error("Error submitting text for summary:", error);
        setError('Failed to submit text for summary. Please try again.');
      }
    } catch (error) {
      console.error("Error submitting text for summary:", error);
    }
  };


  useEffect(() => {
    if (searchUsername) {
      const filteredCasts = allCasts.filter((cast) =>
        cast.data?.castAddBody?.text?.includes(`@${searchUsername}`)
      );
      setDisplayCasts(filteredCasts);
    } else {
      setDisplayCasts(allCasts.slice(startIndex, startIndex + 40));
    }
  }, [searchUsername, allCasts, startIndex]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="flex items-center justify-center space-x-20 pb-2">
        <a
          href={`https://warpcast.com/~/channel/${channelName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-2xl alumni-sans-bold text-indigo-700 hover:underline"
        >
          /{channelName}
        </a>
      </div>
      <div className="w-full sm:w-10/12 mx-auto py-2 bg-stone-100">
        {summary && (
          <article className="text-left text-lg sm:text-2xl font-serif leading-8 sm:leading-10 mx-4 sm:mx-48 py-10 sm:py-20">
            <div className="h-fit text-end inline-block text-[80px] sm:text-[130px] float-left mt-6 sm:mt-12 pr-2 font-display">
              {summary.split('').splice(0, 1)}
            </div>
            <p className="clear-right">{summary.split('').slice(1)}</p>
          </article>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 w-full">
          {displayCasts.map((cast, index) => (
            <CastEntry cast={cast} index={index} key={index} />
          ))}
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => updateDisplayedCasts(startIndex - 40)}
            disabled={startIndex === 0}
            className="alumni-sans-regular mr-2 px-4 py-2 bg-stone-700 text-white disabled:bg-stone-400"
          >
            Previous
          </button>
          <button
            onClick={() => updateDisplayedCasts(startIndex + 40)}
            disabled={startIndex + 40 >= allCasts.length}
            className="alumni-sans-regular px-4 py-2 bg-stone-700 text-white disabled:bg-stone-400"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );



};

export default CastList;

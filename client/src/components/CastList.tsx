import React, { useEffect, useState } from 'react';
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

const CastList = ({ channel }: CastListProps) => {
  const [castsByFid, setCastsByFid] = useState<Cast[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const channelName = channel.split('/').pop();

  useEffect(() => {
    const fetchChannelCasts = async () => {
      setLoading(true);
      try {
        console.log('Fetching casts by channel');

        const response = await axios.get(`https://${config.serverBaseUrl}/castsByChannel/${encodeURIComponent(channel)}`, {
          params: {
            page: page,
            limit: 40,
          },
        });

        console.log(`Fetched casts for channel ${channel}:`, response.data.messages);
        setCasts(prevCasts => [...prevCasts, ...response.data.messages]);
        setHasMore(response.data.messages.length === 40);
      } catch (error) {
        setError('Failed to fetch channel casts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChannelCasts();
  }, [channel, page]);

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const submitTextForSummary = async () => {
    // Find the newest cast's timestamp
    try {
      const newestTimestamp = casts.reduce((newest, cast) => {
        const castTimestamp = new Date(cast.data.timestamp * 1000);
        return castTimestamp > newest ? castTimestamp : newest;
      }, new Date(0));

      // Filter casts from the last 14 days
      const fourteenDaysAgo = new Date(newestTimestamp.getTime() - (14 * 24 * 60 * 60 * 1000));
      const recentCastsTexts = casts.filter(cast => {
        const castTimestamp = new Date(cast.data.timestamp * 1000);
        return castTimestamp >= fourteenDaysAgo;
      }).map(cast => cast.data.castAddBody?.text || '').filter(text => text);

      // Concatenate the texts of all casts
      const concatenatedText = recentCastsTexts.join(' ');

      try {
        const response = await axios.post(`https://${config.serverBaseUrl}/generate_daily_summary`, { text: concatenatedText });
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="flex items-center justify-center space-x-20 my-2">
        <p className="text-3xl newsreader-bold">Fresh casts from {channelName}</p>
      </div>
      <div className="w-full sm:w-10/12 mx-auto py-2 bg-stone-100">
        {summary && (
          <article className="text-left text-lg sm:text-2xl font-serif leading-8 sm:leading-10  mx-4 sm:mx-48 py-10 sm:py-20">
            <div className="h-fit text-end inline-block text-[80px] sm:text-[130px] float-left mt-6 sm:mt-12 pr-2 font-display">
              {summary.split('').splice(0, 1)}
            </div>
            <p className="clear-right">{summary.split('').slice(1)}</p>
          </article>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 w-full">
          {casts.map((cast, index) => (
            <CastEntry cast={cast} index={index} key={index} />
          ))}
        </div>
        {hasMore && (
          <button onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </>
  );
};

export default CastList;

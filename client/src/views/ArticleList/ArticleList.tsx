import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ChangeLog from './../../components/ChangeLog';
import axios from 'axios';
import config2 from './../../config2';
import CastList from './../../components/CastList';

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

interface ArticleListProps {
  channel: string;
  channels: string[];
  onArticleClick: (channelIndex: number) => void;
}

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  timestamp: number;
}

export function ArticleList({ channel, channels, onArticleClick }: ArticleListProps) {
  const [article, setArticle] = useState<Article>({
    id: 0,
    title: "welcome!",
    content: "try clicking a logo!",
    image: "/images/article1.png",
    timestamp: 0,
  });
  const [error, setError] = useState('');
  const backgroundColors = ['#fff205','#ff5050', '#01fff4', '#7cff01', '#d8d8d8', '#ff529d' ];

  return (
    <div className="flex flex-col w-full items-center justify-center pb-2 pl-4 pr-4">
      {error && <div>Error: {error}</div>}
      <div className="w-full mx-auto pt-2">
        <div className="flex flex-col w-full">
          <div className="md:w-full md:pr-4">
            {article && (
              <div className="flex flex-col items-center alumni-sans-regular text-2xl md:text-3xl pl-2 pb-2">
                <h2>{article.title}</h2>
                <p>{article.content}</p>
              </div>
            )}
            <div className="grid grid-cols-3 md:flex md:flex-row md:items-center md:justify-center gap-4 justify-center items-center md:justify-start overflow-hidden md:overflow-visible">
              {/* Display channels as clickable images */}
              {channels.map((chan, index) => {
                const backgroundColor = backgroundColors[index % backgroundColors.length];
                return (
                  <div key={index} className="text-left alumni-sans-regular w-24 md:w-40 flex-shrink-0">
                    <Link
                      to={`/article/${article.id}`}
                      state={{ channelUrl: chan }}
                      onClick={() => onArticleClick(index)}
                      style={{ backgroundColor }}
                      className="block"
                    >
                      <img
                        src={`/images/i_${index + 1}.jpeg`}
                        alt={`Channel ${chan}`}
                        className="h-24 w-24 md:h-40 md:w-40 object-cover"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x300')}
                      />
                      <span className="pl-1 text-md alumni-sans-regular py-1 w-full">
                        /{chan.split('/').pop() || ''}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="md:w-full">
            <CastList channel={channel} searchUsername="" />
          </div>
        </div>
      </div>
    </div>
  );
}

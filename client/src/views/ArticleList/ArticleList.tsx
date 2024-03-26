import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ChangeLog from './../../components/ChangeLog';
import axios from 'axios';
import config from './../../config'; // Ensure this path is correct

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
    title: "welcome !",
    content: "click a channel to generate weekly digest.",
    image: "/images/article1.png",
    timestamp: 0,
  });

  const [error, setError] = useState('');
  const backgroundColors = ['#fff205','#ff5050', '#01fff4', '#7cff01', '#d8d8d8', '#ff529d' ];


  return (
    <div className="flex flex-col w-full items-center justify-center">
      {error && <div>Error: {error}</div>}
      <div className="w-full mx-auto pt-2">
        <div className="flex w-full items-center flex-col md:flex-row">
          {article && (
            <div className="flex flex-col items-center alumni-sans-regular text-2xl md:text-4xl pl-8 pb-2 md:w-5/12 md:pr-8">
              <h2>{article.title}</h2>
              <p>{article.content}</p>
            </div>
          )}
         <div className="md:w-full overflow-x-auto md:pt-2">
            <div className="flex flex-wrap md:flex-nowrap md:flex-row gap-4 justify-center items-center md:justify-start overflow-hidden md:overflow-visible">
              {/* Display channels as clickable images */}
              {channels.map((chan, index) => {
                const backgroundColor = backgroundColors[index % backgroundColors.length];
                  return (
                    <div key={index} className="text-left alumni-sans-regular leading-6 w-40 md:w-80 flex-shrink-0">
                      <Link
                        to={`/article/${article.id}`} // This might need to be dynamic based on the fetched article
                        state={{ channelUrl: chan }}
                        onClick={() => onArticleClick(index)} // Trigger the API call and update the article state
                        style={{ backgroundColor }} // Apply background color dynamically
                        className="block" // Add display block to ensure the background color fills the space
                      >
                        <img
                          src={`/images/i_${index + 1}.jpeg`} // Assuming this is the correct path for your images
                          alt={`Channel ${chan}`}
                          className="h-40 w-40 md:h-96 md:w-80 object-cover"
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
        </div>
      </div>
    </div>
  );
}

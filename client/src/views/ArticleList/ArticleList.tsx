import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ChangeLog from './../../components/ChangeLog';
import axios from 'axios';
import config from './../../config'; // Ensure this path is correct

interface Cast {
  data: {
    castAddBody?: {
      text?: string;
    };
  };
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
}

export function ArticleList({ channel, channels, onArticleClick }: ArticleListProps) {
  const [article, setArticle] = useState<Article>({
    id: 0,
    title: "welcome !",
    content: "click any channel to generate a weekly digest.",
    image: "/images/article1.png",
  });

  const [loadingGpt, setLoadingGpt] = useState(false);
  const [loadingClaude, setLoadingClaude] = useState(false);
  const [error, setError] = useState('');
  const [channelName, setChannelName] = useState('');
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const backgroundColors = ['#fff205','#ff5050', '#01fff4', '#7cff01', '#d8d8d8', '#ff529d' ];

  const openChangelog = () => {
    setIsChangelogOpen(true);
  };

  const closeChangelog = () => {
    setIsChangelogOpen(false);
  };

  const fetchArticlesForChannelGpt = async () => {
    setLoadingGpt(true);
    setError('');
    try {
      const response = await axios.get(`https://${config.serverBaseUrl}/castsByChannel/${encodeURIComponent(channel)}`);
      const responseData = response.data;
      console.log("Response data:", responseData);

      let castsArray = responseData.messages || [];
      console.log("Casts array:", castsArray);

      let summary: string | undefined;
        try {
          const concatenatedText = castsArray.map((cast: any) => cast.data.text || '').join(' ');
          const summaryResponse = await axios.post(`https://${config.serverBaseUrl}/generate_daily_summary`, { text: concatenatedText });
          console.log("Summary response:", summaryResponse.data);
  
          if (summaryResponse.data && typeof summaryResponse.data === 'string') {
            summary = summaryResponse.data;
            console.log("Summaries:", summary);
          } else {
            console.warn("Invalid response from /generate_daily_summary:", summaryResponse.data);
          }
        } catch (error) {
          console.error("Failed to generate articles:", error);
        }

        if (summary) {
          const generatedArticle: Article = {
            id: 1,
            title: "summary of this weeks casts",
            content: summary,
            image: "/images/article1.png"
          };
          console.log("Generated article:", generatedArticle);
          setArticle(generatedArticle);
        } else {
          console.warn("Summary data is not available or invalid");
          setError("Failed to generate the article. Please try again later.");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoadingGpt(false);
      }
    };

  const fetchArticlesForChannelClaude = async (channelUrl: string) => {
    setLoadingClaude(true);
    setError('');
    let summary; 
  
    try {
      const response = await axios.get(`https://${config.serverBaseUrl}/castsByChannel/${encodeURIComponent(channel)}`);
      console.log("Response data:", response.data);
  
      let castsArray = response.data.messages || [];
      console.log("Casts array:", castsArray);
  
      // Concatenate texts of all casts, then truncate to prevent exceeding API limits
      const concatenatedText = castsArray
        .map((cast: Cast) => cast.data.castAddBody?.text || '')
        .join(' ')
        .trim();

      console.log("Concatenated Text:", concatenatedText);
  
      try {
        const summaryResponse = await axios.post(`https://${config.serverBaseUrl}/generate_chat_anthropic`, {
          model: 'claude-3-opus-20240229',
          max_tokens: 200,
          messages: [{ role: 'user', content: concatenatedText }], 
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
  
        console.log("Summary response:", summaryResponse.data);
        summary = summaryResponse.data.content[0].text; 
    
      } catch (error) {
        console.error("Failed to generate articles with Claude:", error);
        setError("Failed to generate articles. Please try again.");
        return; 
      }
  
      if (summary) {
        const generatedArticle = {
          id: Date.now(), 
          title: `generated article for ${channelUrl}`,
          content: summary,
          image: "/images/article1.png", 
        };
  
        console.log("Generated article:", generatedArticle);
        setArticle(generatedArticle);
      } else {
        console.warn("Summary data is not available or invalid");
        setError("Failed to generate the article. Please try again later.");
      }
  
    } catch (error) {
      console.error("Failed to fetch casts data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoadingClaude(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center">
      {error && <div>Error: {error}</div>}
  
      <div className="w-full mx-auto pt-6 pb-4">
        <div className="flex flex-row items-center space-x-4 md:space-x-56 pl-12">
        <div className="alumni-sans-bold text-teal-900 text-md md:text-2xl pb-4">
          click any channel below to generate a weekly digest (open source models coming soon !!!)
        </div>
  
        {/* Add the "View Changelog" button and the ChangelogModal component */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-stone-800 hover:bg-teal-900 alumni-sans-regular text-md text-stone-300 px-4 py-2 rounded"
            onClick={openChangelog}
          >
            view changelog
          </button>
        </div>
        </div>
        {isChangelogOpen && <ChangeLog onClose={closeChangelog} />}
        <div className="flex w-full items-center flex-col md:flex-row">
          {article && (
            <div className="alumni-sans-regular text-3xl md:w-5/12 md:pr-8">
              <h2>{article.title}</h2>
              <p>{article.content}</p>
            </div>
          )}
          <div className="md:w-full overflow-x-auto">
            <div className="flex flex-row space-x-4">
              {/* Display channels as clickable images */}
              {channels.map((chan, index) => {
                const backgroundColor = backgroundColors[index % backgroundColors.length];
                  return (
                    <div key={index} className="text-left alumni-sans-regular pb-8 leading-10 w-80 flex-shrink-0">
                      <button
                        onClick={() => onArticleClick(index)}
                        className="flex flex-col items-center justify-center"
                        style={{ backgroundColor }} // Apply the background color
                      >
                        <img
                          src={`/images/i_${index + 1}.jpeg`} // Adjust image source based on your data
                          alt={`Channel ${chan}`}
                          className="h-96 w-80 object-cover"
                          onError={(e) => ((e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x300')}
                        />
                        <span className="text-left pl-2 text-md alumni-sans-regular py-1 w-full leading-5">
                          /{chan.split('/').pop() || ''}
                        </span>
                      </button>
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

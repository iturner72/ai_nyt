import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
}

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
}

export function ArticleList({ channel, channels }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingGpt, setLoadingGpt] = useState(false);
  const [loadingClaude, setLoadingClaude] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
      const placeholderArticles: Article[] = channels.map((channel, index) => ({
        id: index + 1,
        title: `Placeholder Article ${index + 1}`,
        content: `Click the button to generate a summary for the ${channel} channel.`,
        image: `/images/placeholder_${index + 1}.png`,
      }));

      setArticles(placeholderArticles);
  }, [channels]);

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
          setArticles([generatedArticle]);
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
        setArticles([generatedArticle]);
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
    <div className="flex flex-col items-center justify-center">
      {error && <div>Error: {error}</div>}

      <div className="w-10/12 max-w-7xl mx-auto p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-2 gap-6">
          {articles.map((article: Article, index: number) => (
            <div key={index} className="article text-left text-xl newsreader-regular leading-10 w-full relative">
              <Link
                to={`/article/${article.id}`}
                state={{ channelUrl: channels[index] }}
              >
                <img src={article.image} alt={article.title} className="w-full aspect-video object-cover items-center" onError={(e) => (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/400x300"} />
                <h2 className="text-2xl newsreader-bold py-3 w-full border-b-2 border-dashed border-stone-500 font-header font leading-8">
                  {article.title}
                </h2>
                <span className="pt-3 font-medium text-stone-700 relative opacity-80 leading-6 line-clamp-3">
                  {article.content}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

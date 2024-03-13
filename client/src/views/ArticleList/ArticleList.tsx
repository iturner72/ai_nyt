import React, { useState } from "react";
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
}

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
}

export function ArticleList({ channel }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingGpt, setLoadingGpt] = useState(false);
  const [loadingClaude, setLoadingClaude] = useState(false);
  const [error, setError] = useState('');

  const fetchArticlesForChannelGpt = async () => {
    setLoadingGpt(true);
    setError('');
    try {
      // Hardcoded URL for testing purposes
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
          // Create a single article from the summary
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

  const fetchArticlesForChannelClaude = async () => {
    setLoadingClaude(true);
    setError('');
    let summary; // Moved here to ensure it's accessible throughout the function
  
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
        summary = summaryResponse.data.content[0].text; // Ensure this matches the structure of the Anthropic API response
    
      } catch (error) {
        console.error("Failed to generate articles with Claude:", error);
        setError("Failed to generate articles. Please try again.");
        return; // Exit the function early since we can't proceed without a summary
      }
  
      // Proceed to create an article if a summary was successfully generated
      if (summary) {
        const generatedArticle = {
          id: 1, // Consider using a more dynamic approach for ID if generating multiple articles over time
          title: "Generated Article with Claude",
          content: summary,
          image: "/images/article1.png", // Ensure this image exists or is appropriately handled
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
      <div className="pt-4 flex flex-col md:flex-row space-y-4 items-center md:space-y-0 md:space-x-4">
        <button className="p-3 text-stone-300 newsreader-bold text-sm md:text-base text-center bg-stone-700 hover:bg-stone-900 rounded" onClick={fetchArticlesForChannelClaude} disabled={loadingClaude}>
          {loadingClaude ? "loading..." : "claude 3 opus"}
        </button>
      </div>
      {error && <div>Error: {error}</div>}

      <div className="w-full max-w-4xl mx-auto p-2">
        {articles.map((article: Article, index: number) => (
          <div key={index} className="article text-left text-xl newsreader-regular leading-10 w-full relative my-5">
            {/* Using Link to navigate and pass article data */}
            <Link to={`/article/${article.id}`} state={{ article }}>
              <img src={article.image} alt={article.title} className="w-full aspect-video object-cover items-center" onError={(e) => (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/400x300"} />
              <h2 className="text-[42px] newsreader-bold py-5 w-full border-b-2 border-dashed border-stone-500 font-header font leading-10">
                {article.title}
              </h2>
              <span className="pt-5 font-medium text-stone-700 relative opacity-80 leading-8">
                {article.content}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import config from './../../config'; // Ensure this path is correct

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
}

export function ArticleList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchArticlesForChannel = async () => {
    setLoading(true);
    setError('');
    try {
      // Hardcoded URL for testing purposes
      const channelUrl = "https://warpcast.com/~/channel/onthebrink";
      const response = await axios.get(`https://${config.serverBaseUrl}/castsByChannel/${encodeURIComponent(channelUrl)}`);
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
            title: "Article 1",
            content: summary,
            image: "/images/article1.jpg"
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
        setLoading(false);
      }
    };
  
    function handleArticleClick(id: number) {
      navigate(`/article/${id}`);
    }

  return (
    <div>
      <button className="pt-6 text-emerald-900 newsreader-bold text-xl" onClick={fetchArticlesForChannel} disabled={loading}>
        {loading ? "Loading..." : "generate article"}
      </button>
      {error && <div>Error: {error}</div>}
      <div className="text-left w-10/12 mx-auto px-5 flex flex-wrap justify-between">
        {articles.map((article, index) => (
          <article
            key={index}
            onClick={() => handleArticleClick(article.id)}
            className="article text-left text-xl newsreader-regular leading-10 w-full relative my-5"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full aspect-video object-cover items-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300";
              }}
            />
            <h2 className="text-[42px] newsreader-bold py-5 w-full border-b-2 border-dashed border-stone-500 font-header font leading-10">
              {article.title}
            </h2>
            <span className="pt-5 font-medium text-stone-700 relative opacity-80 overflow-ellipsis overflow-hidden line-clamp-3 leading-8">
              {article.content}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}

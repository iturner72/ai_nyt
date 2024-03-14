import React, { useState, useEffect }from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from './../../config';

interface Article {
  title: string;
  content: string;
  image: string;
}

interface Cast {
  data: {
    castAddBody?: {
      text?: string;
    };
  };
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const channelUrl = state?.channelUrl;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [channelName, setChannelName] = useState('');
  const [modelName, setModelName] = useState('');

  useEffect(() => {
    const fetchArticlesForChannelClaude = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`https://${config.serverBaseUrl}/castsByChannel/${encodeURIComponent(channelUrl)}`);
        const channelName = channelUrl.split('/').pop() || '';
        setChannelName(channelName);
        console.log("Response data:", response.data);

        let castsArray = response.data.messages || [];
        console.log("Casts array:", castsArray);

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
          const summary = summaryResponse.data.content[0].text;
          const modelName = 'Claude 3 Opus';
          setModelName(modelName);

          if (summary) {
            const generatedArticle = {
              id: id ? parseInt(id, 10) : Date.now(),
              title: `${channelUrl}`,
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
          console.error("Failed to generate articles with Claude:", error);
          setError("Failed to generate articles. Please try again.");
        }
      } catch (error) {
        console.error("Failed to fetch casts data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (channelUrl) {
      fetchArticlesForChannelClaude();
    }
  }, [channelUrl, id]);


  if (loading) {
    return (
      <div className="flex items-center h-screen">
        <div className="animate-spin rounded-full w-56 h-56 md:w-72 md:h-72 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!article) {
    return <div>article not found.</div>
  }

  return (
    <div className="w-10/12 px-4 sm:px-8 lg:px-16 py-2">
      <div className="max-w-full lg:max-w-[1400px] mx-auto">
        <article className="text-left text-xl sm:text-2xl lg:text-3xl font-serif leading-relaxed lg:leading-10 mx-auto py-6 lg:py-2">
          <div className="mt-8">
            <h1 className="alumni-sans-bold text-2xl lg:text-5xl mb-2">weekly {channelName} digest</h1>
            <p className="alumni-sans-regular text-lg mb-2">by {modelName}</p>
            <p className="text-stone-500 text-sm">(3 min. read)</p>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="alumni-sans-regular text-xl md:w-2/3 md:pr-8">
              <p>{article.content}</p>
            </div>
            <div className="md:w-1/3">
              <img
                src={article.image}
                alt={article.title}
                className="max-w-full h-auto"
                onError={(e) => ((e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300")}
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

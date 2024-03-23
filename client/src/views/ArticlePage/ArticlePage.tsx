import React, { useState, useEffect }from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from './../../config';

interface Article {
  id: number;
  title: string;
  subtitle: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  image: string;
}

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

      const storedArticle = localStorage.getItem(`article_${channelUrl}`);
      if (storedArticle) {
        setArticle(JSON.parse(storedArticle));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://${config.serverBaseUrl}/castsByChannel/${encodeURIComponent(channelUrl)}`);
        const channelName = channelUrl.split('/').pop() || '';
        setChannelName(channelName);
        console.log("Response data:", response.data);

        let castsArray = response.data.messages || [];
        console.log("Casts array:", castsArray);

        const newestTimestamp = castsArray.reduce((newest: Date, cast: Cast) => {
          const castTimestamp = new Date(cast.data.timestamp * 1000);
          return castTimestamp > newest ? castTimestamp : newest;
        }, new Date(0));

        const oneWeekAgo = new Date(newestTimestamp.getTime() - (7 * 24 * 60 * 60 * 1000));
        const filteredCasts = castsArray.filter((cast: Cast) => {
          const castTimestamp = new Date(cast.data.timestamp * 1000);
          return castTimestamp >= oneWeekAgo;
        }).map((cast: Cast) => cast.data.castAddBody?.text || '').filter((text: string) => text);;

        console.log("filteredCasts:", filteredCasts);

        const concatenatedText = filteredCasts.join(' ');


        const instructionText = `You are The Network Times. This means that you are the new media which will replace the New York Times, Washington Post, Wall Street Journal, and the like. I would like for you to summarize the following Casts in a weekly digest named ${channelName} digest (in lowercase) as a journalist who works for a publication at a higher caliber than those just mentioned. Please format your response with the following tags:
        
        <title>Article Title</title>
        <subtitle>Article Subtitle</subtitle>
        <section>
        <heading>Section Heading</heading>
        <paragraph>Section paragraph content...</paragraph>
        </section>
        
        The article should have a title, a subtitle, and then multiple sections, each with a heading and paragraphs, just like an article in the Times would read. You have a token limit of 2337.
        
        Casts to summarize:
        ` + concatenatedText;


        console.log("Concatenated Text:", concatenatedText);

        try {
          const summaryResponse = await axios.post(`https://${config.serverBaseUrl}/generate_chat_anthropic`, {
            model: 'claude-3-haiku-20240307',
            max_tokens: 2337,
            messages: [{ role: 'user', content: instructionText }],
          }, {
            headers: { 'Content-Type': 'application/json' },
          });

          console.log("Summary response:", summaryResponse.data);
          const summary = summaryResponse.data.content[0].text;
          const modelName = 'Claude 3 Haiku';
          setModelName(modelName);

          if (summary) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(summary, 'text/html');

            const subtitle = doc.querySelector('subtitle')?.textContent || '';

            const sections = Array.from(doc.querySelectorAll('section')).map((section) => {
              const heading = section.querySelector('heading')?.textContent || '';
              const paragraphs = Array.from(section.querySelectorAll('paragraph')).map((p) => p.textContent || '');
              return { heading, paragraphs };
            });
          
            const generatedArticle = {
              id: id ? parseInt(id, 10) : Date.now(),
              title: `${channelName}`,
              subtitle,
              sections,
              image: "/images/article1.png",
            };

            console.log("Generated article:", generatedArticle);
            setArticle(generatedArticle);
            localStorage.setItem(`article_${channelUrl}`, JSON.stringify(generatedArticle));
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
    <div className="w-11/12 px-4 sm:px-8 lg:px-16 py-2">
      <div className="max-w-full lg:max-w-[2200px] mx-auto">
        <article className="text-left text-xl sm:text-2xl lg:text-3xl font-serif leading-relaxed lg:leading-10 mx-auto py-6 lg:py-2">
          <div className="mt-8">
            <h1 className="alumni-sans-bold text-4xl lg:text-5xl mb-2">weekly {channelName} digest</h1>
            <p className="alumni-sans-regular text-xl mb-2">by {modelName}</p>
            <p className="text-stone-500 text-sm">(3 min. read)</p>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="alumni-sans-regular text-xl md:text-4xl md:w-11/12 md:pr-8">
              <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
              <h3 className="text-xl font-semibold mb-6">{article.subtitle}</h3>
              {article.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h4 className="text-3xl font-semibold mb-2">{section.heading}</h4>
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-4 md:text-2xl">{paragraph}</p>
                  ))}
                </div>
              ))}
            </div>
            <div className="md:w-7/12 pt-8">
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

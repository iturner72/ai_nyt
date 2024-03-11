import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

export default function ArticlePage() {
  const { state } = useLocation();
  const article = state?.article; // Assuming you pass article data through state

  // If article data isn't passed through state, you'd need to fetch it based on ID or another identifier

  if (!article) {
    return <div>Article not found or not provided.</div>;
  }

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-10"> 
       <div className="max-w-full lg:max-w-[1400px] mx-auto">
          <article className='text-left text-xl sm:text-2xl lg:text-3xl font-serif leading-relaxed lg:leading-10 mx-auto py-10 lg:py-20'>
            <h1 className="text-3xl lg:text-5xl mb-4">{article.title}</h1>
            <img src={article.image} alt={article.title} className="max-w-full h-auto" onError={(e) => ((e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300")}/>
            <p>{article.content}</p>
          </article>
       </div>
    </div>
  );
}

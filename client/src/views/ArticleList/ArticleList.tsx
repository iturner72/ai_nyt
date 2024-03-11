import dummydata from "./dummydata";
import React from "react";
import {useNavigate} from "react-router-dom";

export function ArticleList() {
  const navigate = useNavigate();

  function handleArticleClick(id: number) {
    navigate(`/article/${id}`);
  }

  return (
    <div>
      <div className={'text-left w-10/12 mx-auto px-5 flex flex-wrap justify-between'}>
        {/*List to display all other articles*/}
        {
          dummydata.map((article: any, index: number) => (
            <>
              <article
                onClick={() => handleArticleClick(article.id)}
                className={'article text-left text-xl newsreader-regular leading-10 w-full relative my-5'}>
                <img src={article.image} alt={article.title}
                     className={'w-full aspect-video object-cover items-center '} onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300'
                }}/>
                <h2
                  className={'text-[42px] newsreader-bold py-5 w-full border-b-2 border-dashed border-stone-500 font-header font leading-10'}>{article.title}</h2>
                <span
                  className={'pt-5 font-medium text-stone-700 relative opacity-80 overflow-ellipsis overflow-hidden line-clamp-3 leading-8'}>{article.content}</span>
              </article>

            </>
          ))
        }
      </div>
    </div>
  );
}

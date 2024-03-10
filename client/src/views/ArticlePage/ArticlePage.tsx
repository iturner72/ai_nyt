import {useParams} from "react-router-dom";
import React from "react";
import dummydata from "../ArticleList/dummydata";

export default function ArticlePage() {
  const { id } = useParams();

  const article = dummydata.find((article) => article.id === Number(id));

  return (
    <div>
       <div className=" max-w-[1400px] mx-auto py-10">
        {article && (
          <article className={'text-left text-2xl font-serif leading-10 mx-48 py-20'}>
            <div
              className={' h-fit text-end inline-block text-[130px] float-left mt-12 pr-2 font-display'}>{article.content.split('').splice(0, 1)}</div>
            <p className={'clear-right'}>{article.content.split('').slice(1)}</p>
          </article>
        )}
       </div>
    </div>
  );
}
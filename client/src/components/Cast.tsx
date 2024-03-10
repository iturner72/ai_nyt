import {Cast} from "../types/Casts";
import React from "react";

interface CastProps {
  cast: Cast;
  index: number;
}

export default function CastEntry({cast, index}: CastProps) {
  return cast.data ?
    <div key={index} className={'w-full border-stone-500  min-h-60 flex justify-between p-4 relative text-left rounded-xl bg-stone-300'}>
      <div>
        <div className={' border-b-4 border-stone-400 w-fit '}>
          <h3>@username</h3>
        </div>
        <div key={cast.hash} className={'font-serif mt-1 text-wrap  '}>
          {/*<h3>{cast.data?.fid}</h3>*/}
          <p className={'break-all hyphens-auto'}>{cast.data?.castAddBody ? cast.data?.castAddBody?.text : 'N/A'}</p>
        </div>
      </div>
      {/*{*/}
      {/*  cast.data?.castAddBody?.embeds.length > 0 ?*/}
      {/*    <div className={' right-0 top-0 h-full w-56 aspect-square'}>*/}
      {/*      {*/}
      {/*        cast.data?.castAddBody?.embeds.map((embed: any) => (*/}
      {/*          <img key={embed.url} src={embed.url} alt={embed.url} className={' w-full h-full object-cover'}*/}
      {/*               onError={(e) => {*/}
      {/*                 (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';*/}
      {/*               }}/>*/}
      {/*        ))*/}
      {/*      }*/}
      {/*    </div>*/}
      {/*    : null*/}
      {/*}*/}

    </div>
    : null;
}
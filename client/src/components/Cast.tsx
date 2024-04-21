import { Cast } from "../types/Casts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import config2 from './../config2';
import Linkify from 'react-linkify';
import ImageDetails from "./ImageDetails";
import { TwitterTweetEmbed } from "react-twitter-embed";

interface CastProps {
  cast: Cast;
  index: number;
}

interface UserData {
  data: {
    type: string;
    fid: number;
    timestamp: number;
    network: string;
    userDataBody: {
      type: string;
      value: string;
    };
  };
  hash: string;
  hashScheme: string;
  signature: string;
  signatureScheme: string;
  signer: string;
}

interface ReactionData {
  messages?: {
    data: {
      fid: number;
      network: string;
      reactionBody: {
        targetCastId: {
          fid: number;
          hash: string;
        };
        type: string;
      };
      timestamp: number;
      type: string;
    };
    hash: string;
    hashScheme: string;
  }[];
  nextPageToken: string;
}

function getTweetId(url: string): string | null {
  const match = url.match(/\/(\d+)(?:\?.*)?$/);
  return match ? match[1] : null;
}

function getDomain(url: string): string {
  const domain = new URL(url).hostname;
  return domain.startsWith('www.') ? domain.slice(4) : domain;
}

function isNewCdnUrl(url: string): boolean {
    return url.includes('imagedelivery.net');
}

export default function CastEntry({ cast, index }: CastProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPfpData, setUserPfpData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pfpLoading, setPfpLoading] = useState<boolean>(true);
  const [reactionData, setReactionData] = useState<ReactionData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {

        const reactionsResponse = await axios.get(`https://${config2.serverBaseUrl}/reactionsByCast`, {
          params: {
            target_fid: cast.data?.fid,
            target_hash: cast.hash,
            reaction_type: 'REACTION_TYPE_LIKE',
          },
        });

        if (reactionsResponse.status === 200 && reactionsResponse.data) {
          setReactionData(reactionsResponse.data);
          console.log("Reaction Data:", reactionsResponse.data);
        }

        const usernameResponse = await axios.get(`https://${config2.serverBaseUrl}/userDataByFid`, {
          params: {
            fid: cast.data?.fid,
            user_data_type: 6,
          },
        });

        if (usernameResponse.status === 200 && usernameResponse.data) {
          setUserData(usernameResponse.data);
          setLoading(false);
        }

        const pfpResponse = await axios.get(`https://${config2.serverBaseUrl}/userDataByFid`, {
          params: {
            fid: cast.data?.fid,
            user_data_type: 1,
          },
        });

        if (pfpResponse.status === 200 && pfpResponse.data) {
          setUserPfpData(pfpResponse.data);
        }
        setPfpLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
        setPfpLoading(false);
      }
    };

    fetchUserData();
  }, [cast.data?.fid, cast.hash]);

  return cast.data ? (
    <div key={index} className="flex flex-col text-left p-4 pl-4 bg-stone-200 border border-stone-500">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          {pfpLoading ? (
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse mr-2" />
          ) : userPfpData?.data?.userDataBody?.value ? (
            <a href={`https://warpcast.com/${userData?.data?.userDataBody?.value}`} target="_blank" rel="noopener noreferrer">
              <img
                src={userPfpData.data.userDataBody.value}
                alt="User PFP"
                className="w-12 h-12 rounded-full object-cover object-center mr-2"
              />
            </a>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 mr-2" />
          )}
          <h3 className="alumni-sans-bold text-indigo-800 text-lg md:text-xl">
            {loading ? (
              <div className="w-24 h-6 bg-stone-400 animate-pulse" />
            ) : (
              <a href={`https://warpcast.com/${userData?.data?.userDataBody?.value}`} target="_blank" rel="noopener noreferrer">
                @{userData?.data?.userDataBody?.value || "No username"}
              </a>
            )}
          </h3>
        </div>
        <a href={`https://warpcast.com/${userData?.data?.userDataBody?.value}/${cast.hash}`} target="_blank" rel="noopener noreferrer">
          <img src="/images/fc.png" alt="Farcaster" className="w-8 h-8 ml-2" />
        </a>
      </div>
      <div className="flex-grow pt-2">
        <p className="alumni-sans-regular text-lg md:text-xl break-words hyphens-auto" style={{ lineHeight: 1.122 }}>
          {cast.data?.castAddBody ? (
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a
                  href={decoratedHref}
                  key={key}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 'bold', color: '#0d9488' }}
                >
                  {getDomain(decoratedHref)}
                </a>
              )}
            >
              {cast.data?.castAddBody?.text}
            </Linkify>
          ) : 'N/A'}
        </p>
        <div className="flex items-center mt-2">
          <span className="text-sm text-gray-600 mr-1">
            {reactionData && reactionData.messages ? reactionData.messages.length : 0}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          </div>
        {cast.data?.castAddBody?.embeds && cast.data.castAddBody.embeds.length > 0 && (
          <div className="mt-2">
            {cast.data.castAddBody.embeds.map((embed: any, index: number) => {
              if (embed && embed.url && (embed.url.includes('i.imgur') || isNewCdnUrl(embed.url))) {
                return (
                  <ImageDetails
                    key={index}
                    src={embed.url}
                    alt={`Embed ${index}`}
                  />
                );
              } else if (embed && embed.url && embed.url.includes('twitter.com')) {
                const tweetId = getTweetId(embed.url);
                if (tweetId) {
                  return (
                    <div key={index} className="mt-4">
                      <TwitterTweetEmbed tweetId={tweetId} />
                    </div>
                  );
                }
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  ) : null;
}

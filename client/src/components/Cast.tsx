import { Cast } from "../types/Casts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import config2 from './../config2';

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

export default function CastEntry({ cast, index }: CastProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPfpData, setUserPfpData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pfpLoading, setPfpLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
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
  }, [cast.data?.fid]);

  return cast.data ? (
    <div key={index} className="flex flex-col text-left p-4 pl-4 bg-stone-200 border border-stone-500">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          {pfpLoading ? (
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse mr-2" />
          ) : userPfpData?.data?.userDataBody?.value ? (
            <img
              src={userPfpData.data.userDataBody.value}
              alt="User PFP"
              className="w-12 h-12 rounded-full object-cover object-center mr-2"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 mr-2" />
          )}
          <h3 className="alumni-sans-bold text-stone-500 text-lg md:text-xl">
            {loading ? (
              <div className="w-24 h-6 bg-gray-300 animate-pulse" />
            ) : (
              `@${userData?.data?.userDataBody?.value || "No username"}`
            )}
          </h3>
        </div>
        <img src="/images/fc.jpeg" alt="Farcaster" className="w-6 h-6 ml-2" />
      </div>
      <div className="flex-grow pt-2">
        <p className="alumni-sans-regular text-lg md:text-xl break-words hyphens-auto" style={{ lineHeight: 1.172 }}>
          {cast.data?.castAddBody ? cast.data?.castAddBody?.text : 'N/A'}
        </p>
      </div>
    </div>
  ) : null;
}

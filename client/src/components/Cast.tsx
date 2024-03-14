import { Cast } from "../types/Casts";
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from './../config';

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://${config.serverBaseUrl}/userDataByFid`, {
          params: {
            fid: cast.data?.fid,
            user_data_type: 6,
          },
        });
        if (response.status === 200 && response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [cast.data?.fid]);

return cast.data ? (
  <div key={index} className="flex flex-col text-left p-4 pl-6 bg-stone-200 border border-stone-500">
    <div className="flex-grow">
      <p className="alumni-sans-regular text-lg md:text-xl break-words hyphens-auto" style={{ lineHeight: 1.172 }}>
        {cast.data?.castAddBody ? cast.data?.castAddBody?.text : 'N/A'}
      </p>
    </div>
    <div className="flex flex-row items-center justify-between mt-4">
      <h3 className="alumni-sans-bold text-stone-500 text-lg md:text-xl">
        {loading ? (
          "Loading..."
        ) : (
          `@${userData?.data?.userDataBody?.value || "No username"}`
        )}
      </h3>
      <img src="/images/fc.jpeg" alt="Farcaster" className="w-6 h-6 ml-2" />
    </div>
  </div>
) : null;
}

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
    <div key={index} className={'w-full border-stone-500 min-h-60 flex justify-between p-4 relative text-left bg-stone-200'}>
      <div>
        <div className={' border-b-1 border-stone-400 w-fit '}>
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <h3>@{userData?.data?.userDataBody?.value || "No username"}</h3>
          )}
        </div>
        <div key={cast.hash} className={'newsreader-regular mt-1 text-wrap '}>
          <p className={'break-all hyphens-auto'}>{cast.data?.castAddBody ? cast.data?.castAddBody?.text : 'N/A'}</p>
        </div>
      </div>
    </div>
  ) : null;
}

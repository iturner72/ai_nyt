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

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [usernameResponse, pfpResponse] = await Promise.all([
          axios.get(`https://${config2.serverBaseUrl}/userDataByFid`, {
            params: {
              fid: cast.data?.fid,
              user_data_type: 6,
            },
          }),
          axios.get(`https://${config2.serverBaseUrl}/userDataByFid`, {
            params: {
              fid: cast.data?.fid,
              user_data_type: 1,
            },
          }),
        ]);

        if (usernameResponse.status === 200 && usernameResponse.data) {
          setUserData(usernameResponse.data);
        }
        if (usernameResponse.status === 200 && pfpResponse.data) {
          setUserPfpData(pfpResponse.data);
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
  {loading ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className="flex items-center">
        {userPfpData?.data?.userDataBody?.value && (
          <img
            src={userPfpData.data.userDataBody.value}
            alt="User PFP"
            className="w-8 h-8 rounded-full mr-2"
          />
        )}
        <h3 className="alumni-sans-bold text-stone-500 text-lg md:text-xl">
          @{userData?.data?.userDataBody?.value || "No username"}
        </h3>
      </div>
      <img src="/images/fc.jpeg" alt="Farcaster" className="w-6 h-6 ml-2" />
    </>
  )}
</div>


  </div>
) : null;
}

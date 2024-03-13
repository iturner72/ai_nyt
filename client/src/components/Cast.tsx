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
    <div key={index} className="min-h-20 flex flex-col justify-between p-4 bg-stone-200 border border-stone-500">
      <div className="mb-4"> {/* Add margin-bottom for spacing on mobile */}
        <h3 className="font-bold border-b border-stone-400 mb-2 text-sm sm:text-base"> {/* Smaller text on small screens, standard size on sm screens and up */}
          {loading ? (
            "Loading..."
          ) : (
            `@${userData?.data?.userDataBody?.value || "No username"}`
          )}
        </h3>
        <p className="text-xs sm:text-sm break-words hyphens-auto"> {/* Smaller text on small screens, standard size on sm screens and up */}
          {cast.data?.castAddBody ? cast.data?.castAddBody?.text : 'N/A'}
        </p>
      </div>
    </div>
  ) : null;

}

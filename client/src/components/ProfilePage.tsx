import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config2 from '../config2';
import { useParams } from 'react-router-dom';

interface UserDataMessage {
  data: {
    fid: number;
    network: string;
    timestamp: number;
    type: string;
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

interface UserData {
  fid: number;
  displayName: string;
  bio: string;
  url: string;
  username: string;
  profilePictureUrl: string;
}

const ProfilePage: React.FC = () => {
  const { fid } = useParams<{ fid: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://${config2.serverBaseUrl}/userDataByFid?fid=${fid}`);
        const messages: UserDataMessage[] = response.data.messages;

        const userDataObj: UserData = {
          fid: Number(fid),
          displayName: '',
          bio: '',
          url: '',
          username: '',
          profilePictureUrl: '',
        };

        messages.forEach((message) => {
          const { type, value } = message.data.userDataBody;
          switch (type) {
            case 'USER_DATA_TYPE_USERNAME':
              userDataObj.username = value;
              break;
            case 'USER_DATA_TYPE_DISPLAY':
              userDataObj.displayName = value;
              break;
            case 'USER_DATA_TYPE_PFP':
              userDataObj.profilePictureUrl = value;
              break;
            case 'USER_DATA_TYPE_BIO':
              userDataObj.bio = value;
              break;
            // Add more cases for other user data types if needed
          }
        });

        setUserData(userDataObj);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [fid]);

  if (!userData) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={userData.profilePictureUrl} alt="Profile" className="profile-picture" />
        <h2 className="display-name">{userData.displayName}</h2>
        <p className="username">@{userData.username}</p>
      </div>
      <div className="profile-details">
        <p className="bio">{userData.bio}</p>
        <p className="url">
          <a href={userData.url} target="_blank" rel="noopener noreferrer">
            {userData.url}
          </a>
        </p>
        <p className="fid">FID: {userData.fid}</p>
      </div>
    </div>
  );
};

export default ProfilePage;

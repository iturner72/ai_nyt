import React, { useState } from 'react';
import { useAppClient } from '@farcaster/auth-kit';

export const SignIn = () => {
  const appClient = useAppClient();
  const [channelToken, setChannelToken] = useState('');
  const [qrCodeUri, setQrCodeUri] = useState('');
  const [username, setUsername] = useState('');

  const handleSignIn = async () => {
    if (!appClient) return;

    try {
      const { data } = await appClient.createChannel({
        siweUri: 'https://thenetworktimes.xyz/login',
        domain: 'thenetworktimes.xyz',
      });

      setChannelToken(data.channelToken);
      setQrCodeUri(data.url);

      const { data: statusData } = await appClient.watchStatus({
        channelToken: data.channelToken,
        onResponse: ({ data: responseData }) => {
          if (responseData.state === 'completed') {
            setUsername(responseData.username || '');
          }
        },
      });

      const { success, fid } = await appClient.verifySignInMessage({
        nonce: statusData.nonce,
        domain: 'example.com',
        message: statusData.message || '',
        signature: statusData.signature ? `0x${statusData.signature}`: '0x',
      });

      if (success) {
        console.log('Sign-in successful. FID:', fid);
      } else {
        console.error('Sign-in verification failed.');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  return (
    <div>
      <button onClick={handleSignIn}>Sign In</button>
      {qrCodeUri && (
        <span>
          Scan this: <img src={qrCodeUri} alt="QR Code" />
        </span>
      )}
      {username && `Hello, ${username}!`}
    </div>
  );
};

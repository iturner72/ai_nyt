import React from 'react';
import { SignInButton } from '@farcaster/auth-kit';

export const SignIn = () => {
  const handleSignInSuccess = (res: any) => {
    if (typeof res === 'object' && res !== null) {
      if (typeof res.fid === 'number' && typeof res.username === 'string') {
        const { fid, username } = res;
        console.log(`Hello, ${username}! Your fid is ${fid}.`);
        localStorage.setItem('userFid', fid.toString());
      } else {
        console.error('Sign-in response missing required properties:', res);
      }
    } else {
      console.error('Sign-in failed:', res);
    }
  };

  return (
    <div className="signin-button">
      <SignInButton onSuccess={handleSignInSuccess} />
    </div>
  );
};

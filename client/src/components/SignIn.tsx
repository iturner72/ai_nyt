import React from 'react';
import { SignInButton } from '@farcaster/auth-kit';

export const SignIn = () => {
  const handleSignInSuccess = ({ fid, username }) => {
    console.log(`Hello, ${username}! Your fid is ${fid}.`);
    localStorage.setItem('userFid', fid.toString()); 
  };

  return (
    <div className="signin-button">
      <SignInButton onSuccess={handleSignInSuccess} />
    </div>
  );
};

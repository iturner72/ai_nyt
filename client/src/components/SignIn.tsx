// SignIn.tsx
import React from 'react';
import { SignInButton } from '@farcaster/auth-kit';

export const SignIn = () => {
  return (
    <div className="signin-button">
      <SignInButton onSuccess={({ fid, username }) => console.log(`Hello, ${username}! Your fid is ${fid}.`)} />
    </div>
  );
};


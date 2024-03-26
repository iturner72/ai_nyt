// UserProfile.tsx
import React from 'react';
import { useProfile } from '@farcaster/auth-kit';

export const UserProfile = () => {
  const { isAuthenticated, profile } = useProfile();

  return (
    <>
      {isAuthenticated && profile ? (
        <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#ffffff' }}>
          <p>test</p>
          {/* Display more user info as needed */}
        </div>
      ) : null}
    </>
  );
};


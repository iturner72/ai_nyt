import React, { useEffect, useState } from 'react';

interface UserNameProof {
  timestamp: number;
  name: string;
  owner: string;
  signature: string;
  fid: number;
  type: string;
}

interface UserNameProofsProps {
  fid: number;
}

const UserNameProofs: React.FC<UserNameProofsProps> = ({ fid }) => {
  const [proofs, setProofs] = useState<UserNameProof[]>([]);

  useEffect(() => {
    const fetchUserNameProofs = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/userNameProofsByFid/${fid}`);
        const data = await response.json();
        setProofs(data.proofs);
      } catch (error) {
        console.error('Error fetching user name proofs:', error);
      }
    };

    fetchUserNameProofs();
  }, [fid]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">User Name Proofs for FID: {fid}</h2>
      {proofs.length === 0 ? (
        <p>No user name proofs found for this FID.</p>
      ) : (
        <ul>
          {proofs.map((proof, index) => (
            <li key={index} className="mb-2">
              <strong>Name:</strong> {proof.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserNameProofs;

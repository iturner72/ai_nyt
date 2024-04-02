import React, { useState } from 'react';

interface ImageDetailsProps {
  src: string;
  alt: string;
}

const ImageDetails: React.FC<ImageDetailsProps> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto pt-2 cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-150 flex justify-center items-center">
          <div className="bg-indigo-500 bg-opacity-50 p-14">
            <img src={src} alt={alt} className="max-w-full max-h-full" />
            <button onClick={() => setIsOpen(false)} className="mt-2">close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageDetails;

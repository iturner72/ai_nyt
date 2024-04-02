import React, { useState } from 'react';

interface ImageDetailsProps {
  src: string;
  alt: string;
}

const ImageDetails: React.FC<ImageDetailsProps> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).id === 'overlay') {
      setIsOpen(false);
    }
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto pt-2 cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          id="overlay"
          className="fixed inset-0 bg-black bg-opacity-50 z-150 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="flex flex-col bg-indigo-500 bg-opacity-50 p-4"
            onClick={(event) => event.stopPropagation()} 
          >
            <img src={src} alt={alt} className="max-w-[80vw] max-h-[80vh] md:max-w-screen-sm md:max-h-[80vh]" />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageDetails;

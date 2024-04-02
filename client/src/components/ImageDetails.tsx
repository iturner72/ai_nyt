import React, { useEffect, useState } from 'react';

interface ImageDetailsProps {
  src: string;
  alt: string;
}

const ImageDetails: React.FC<ImageDetailsProps> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = (event: React.MouseEvent | KeyboardEvent) => {
    if (
      (event as React.MouseEvent).target &&
      ((event as React.MouseEvent).target as HTMLElement).id === 'overlay'
    ) {
      setIsOpen(false);
    } else if ((event as KeyboardEvent).key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal(event);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto cursor-pointer border-2 border-indigo-600 border-opacity-40 shadow-2xl"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          id="overlay"
          className="fixed inset-0 bg-stone-900 bg-opacity-70 z-150 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="flex flex-col bg-indigo-500 bg-opacity-50 p-1"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-[80vw] max-h-[80vh] md:max-w-screen-sm md:max-h-[80vh] border-2 border-indigo-500 shadow-md"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageDetails;

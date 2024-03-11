import React from 'react';

interface InformationModalProps {
  closeModal: () => void; // Defines closeModal as a function that returns nothing
}

const InformationModal: React.FC<InformationModalProps> = ({ closeModal }) => {
  return (
    <>
      <div className="fixed newsreader-regular inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeModal}>
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
          <div className="mt-3 text-center">
            <h3 className="text-3xl leading-6 font-medium text-gray-900">Lock In</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-lg text-gray-500">
                The Network Times was hacked together in a weekend for a Balaji Bounty. The website is a combination of The New York Times and Pirate Wires (River is my GOAT). I strongly believe that LLMs (the current SOTA) should be complements to human journalists; not replacements. That being said, this assembly of LLMs will crush the NYT, WSJ, and the like. Stay tuned for exciting new features (proper postgres db, ai writer personalities, image generation, and more)!
              </p>
            </div>
            <div className="items-center px-4 py-3">
              <button onClick={closeModal} className="px-4 py-2 bg-stone-700 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InformationModal;

import React from 'react';

interface ChangeLogProps {
  onClose: () => void;
}

const ChangeLog: React.FC<ChangeLogProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white w-11/12 md:w-3/4 lg:w-2/6 h-3/6 p-6 shadow-lg rounded-none">
        <button
          className="absolute top-2 right-2 text-stone-700 hover:text-teal-900"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="newsreader-bold text-5xl font-bold pt-10 mb-4">change log & feature roadmap</h2>
        <div className="newsreader-regular mb-6">
          <h3 className="newsreader-bold text-3xl font-semibold mb-2">change log</h3>
          <ul className="text-xl pl-6">
            <li>casts by channel tabs to navbar</li>
            <li>add support for gpt 3.5 turbo</li>
            <li>add support for claude 3 opus</li>
            <li>remove support for gpt 3.5 turbo</li>
            <li>terminal for sophisticated grep in the future</li>
            <li>auto channel tab state change on article generation</li>
          </ul>
        </div>
        <div>
          <h3 className="newsreader-bold text-3xl font-semibold mb-2">feature roadmap</h3>
          <ol className="newsreader-regular text-xl pl-6">
            <li>add git (maybe...) to changelog</li>
            <li>add mistral model</li>
            <li>create write personalities</li>
            <li>implement user authentication and personalization</li>
            <li>add support for multiple LLM models</li>
            <li>introduce article sharing and collaboration features</li>
            <li>... to be determined</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ChangeLog;

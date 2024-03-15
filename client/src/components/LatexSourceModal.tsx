import React from 'react';

interface LatexSourceModalProps {
  closeModal: () => void;
}

const LatexSourceModal: React.FC<LatexSourceModalProps> = ({ closeModal }) => {


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">LaTeX Source Code</h2>
        <pre className="bg-gray-100 p-4 rounded-md mb-4 overflow-auto">
          {
           `\\documentclass{article}
            \\begin{document}
            Hello, World!
            \\end{document}`
          }
        </pre>
        <a
          href="/documents/notes.pdf"
          download="change_log.pdf"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Download PDF
        </a>
        <button
          onClick={closeModal}
          className="ml-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LatexSourceModal;

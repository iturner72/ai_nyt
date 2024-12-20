import React from 'react';

interface LatexSourceModalProps {
  closeModal: () => void;
}

const LatexSourceModal: React.FC<LatexSourceModalProps> = ({ closeModal }) => {
  const handleOpenPDF = () => {
    window.open('/documents/notes.pdf', '_blank');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-10/12 md:w-4/12">
        <h2 className="text-3xl font-bold mb-4">LaTeX Source Code</h2>
        <pre className="bg-gray-100 text-xs md:text-xl p-4 rounded-md mb-4">
          {`\\documentclass{article}
\\begin{document}
\\textbf{\\textit{article(s) local
\\ storage cleared every 2 hrs btw}}.
\\section*{What's This?}
\\This (the PDF) is a changelog
\\ that I'll update periodically.
\\end{document}`}
        </pre>
        <div className="flex flex-col items-center justify-center">
          <a
            href="https://github.com/iturner72/ai_nyt.git"
            target="_blank"
            className="bg-black alumni-sans-regular text-xl hover:bg-stone-200 hover:text-black text-white px-4 py-2 rounded-md"
          >
            Github
          </a>
          <div className="flex flex-row items-center justify-center pt-2">
            <button
              onClick={handleOpenPDF}
              className="bg-stone-600 hover:bg-stone-800 alumni-sans-regular text-xl text-white px-4 py-2 rounded-md"
            >
              Open PDF
            </button>
            <button
              onClick={closeModal}
              className="ml-4 alumni-sans-regular text-xl bg-gray-300 text-stone-800 px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatexSourceModal;

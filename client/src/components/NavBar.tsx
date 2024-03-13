import React from 'react';

interface NavBarProps {
  channels: string[];
  currentChannelIndex: number;
  setCurrentChannelIndex: (index: number) => void;
}

export default function NavBar({ channels, currentChannelIndex, setCurrentChannelIndex }: NavBarProps) {
  const handleTabClick = (tabIndex: number) => {
    setCurrentChannelIndex(tabIndex);
  };

  return (
    <div className="sticky top-0 z-20 w-full flex justify-center">
      <div className="w-10/12 overflow-x-auto">
        <div className="flex items-center justify-between bg-stone-100 font-sans border-b border-neutral-200">
          {channels.map((channel, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`w-full text-left h-10 border-t border-r p-2 border-stone-700 last:border-r first:border-l font-semibold border-b ${
                currentChannelIndex === index ? 'bg-stone-200 border-stone-500 text-stone-900' : 'bg-stone-900 text-stone-50'
              }`}
            >
              /{channel.split('/').pop()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between bg-stone-100 font-sans border-b border-neutral-200">
        {channels.map((channel, index) => {
          const backgroundColors = ['#fdf351', '#eb5d56', '#75fcf3', '#9efc4e', '#d8d8d8', '#eb5f9b']; // Define your colors here
          const backgroundColor = backgroundColors[index % backgroundColors.length]; // Cycle through colors based on index
          return (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`w-full text-center border-t h-8 text-sm pl-1 border-r last:border-r first:border-l font-semibold ${
                currentChannelIndex === index ? 'border-b-2 border-black' : 'border-stone-700'
              }`}
              style={{ backgroundColor }}
            >
              /{channel.split('/').pop()}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);


}

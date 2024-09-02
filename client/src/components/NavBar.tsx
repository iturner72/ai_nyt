import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  channels: string[];
  currentChannelIndex: number;
  setCurrentChannelIndex: (index: number) => void;
}

export default function NavBar({ channels, currentChannelIndex, setCurrentChannelIndex }: NavBarProps) {
  const navigate = useNavigate();

  const handleTabClick = (tabIndex: number) => {
    setCurrentChannelIndex(tabIndex);
    navigate('/');
  };

return (
  <div className="sticky top-0 z-20 w-full flex justify-center">
    <div className="w-full overflow-x-auto">
      <div className="flex items-center text-2xl alumni-sans-bold justify-between bg-stone-100 font-sans border-b border-neutral-200">
        {channels.map((channel, index) => {
          const backgroundColors = ['#7cff01', '#ff5050', '#01fff4', '#fff205', '#d8d8d8', '#ff529d' ]; // Define your colors here

          const backgroundColor = backgroundColors[index % backgroundColors.length]; // Cycle through colors based on index
          return (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`w-full text-center border-t h-14 md:h-10 text-md pr-2 pl-2 font-semibold leading-5 ${
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

interface NavBarProps {
  channels: string[];
  currentChannelIndex: number;
  setCurrentChannelIndex: (index: number) => void;
}

export default function NavBar({channels, currentChannelIndex, setCurrentChannelIndex}: NavBarProps) {
  return (
    <div className={'sticky top-0'}>
      <div
        className="flex items-center justify-between bg-stone-100 font-sans border-b border-neutral-200 ">
        {
          channels.map((channel, index) => (
            <button
              key={index}
              onClick={() => setCurrentChannelIndex(index)}
              className={`w-full text-left border-t-2 border-r-2 p-2 border-stone-700 last:border-r-0 font-semibold border-b-2 ${currentChannelIndex === index ? 'bg-stone-200 border-stone-500 text-stone-900' : 'bg-stone-900 text-stone-50'}`}>
              /{channel.split('/').pop()}
            </button>
          ))
        }
      </div>
      <div className={'w-full'}>

      </div>
    </div>
  )
}
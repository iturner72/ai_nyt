import React, { useState, useEffect } from 'react';
import CastList from './components/CastList';
import NavBar from "./components/NavBar";
import axios from "axios";
import {Routes, Route, useNavigate} from "react-router-dom";
import {ArticleList} from "./views/ArticleList/ArticleList";
import ArticlePage from "./views/ArticlePage/ArticlePage";
import InformationModal from './components/InformationModal';
import InfoIcon from '@mui/icons-material/Info';
import config from "./config";
import TerminalComponent from './components/TerminalComponent';

const channels = ['https://warpcast.com/~/channel/onthebrink', 'https://warpcast.com/~/channel/piratewires', 'https://warpcast.com/~/channel/moz', 'https://warpcast.com/~/channel/zynwood', 'https://warpcast.com/~/channel/gray', 'https://warpcast.com/~/channel/all-in']
const fids = [249223, 5650, 37, 97, 151, 318610, 319431]
// Ian, Vitalik, Balaji, Nic, Matt, Solana, Ryan

const App: React.FC = () => {
  const [currentChannelIndex, setCurrentChannelIndex] = React.useState<number>(0);
  const [allChannels, setAllChannels] = React.useState<Channel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  function filterChannels(allChannels: Channel[], url: string) {
    return allChannels.filter(channel => channels.includes(channel.url));
  }

  function navigateHome() {
    navigate('/')
  }

  useEffect(() => {
    async function fetchChannels() {
      try {
        axios.get(`https://${config.serverBaseUrl}/channels`).then(res => {
          console.log('Channels:', res.data.channels);
          setAllChannels(res.data.channels);
        });
      } catch (error) {
        console.error('Failed to fetch channels. Please try again.');
      }
    }

    fetchChannels();
  }, []);

  return (
    <div className="flex flex-col items-center text-center bg-stone-100">
      <div className="h-32 w-full relative flex justify-center items-center">
        {/* Make sure the entire div is clickable, or just the title text if you prefer */}
        <div className="absolute left-0 top-0 w-full h-full" onClick={navigateHome}></div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[60px] font-display py-5 whitespace-nowrap cursor-pointer">
          The Network Times
        </h1>
        <InfoIcon 
          onClick={() => setIsModalOpen(true)}
          aria-label="Information"
          style={{ position: 'absolute', right: '20px', color: '#0c0a09', fontSize: '36px' }}
        />
      </div>
      <NavBar channels={channels} currentChannelIndex={currentChannelIndex} 
              setCurrentChannelIndex={setCurrentChannelIndex}/>
      <TerminalComponent />
      <Routes>
        <Route path={'/'} element={<ArticleList />}/>
        <Route path={'/article/:id'} element={<ArticlePage/>}/>
      </Routes>
      <div className="bg-stone-100">
        <CastList channel={channels[currentChannelIndex]}/>
      </div>
      {isModalOpen && <InformationModal closeModal={() => setIsModalOpen(false)} />}
    </div>
  );



}

export default App;

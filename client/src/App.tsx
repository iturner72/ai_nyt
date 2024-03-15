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
import { ReactComponent as Title } from './icons/Title.svg';
import LatexSourceModal from './components/LatexSourceModal';

const channels = ['https://warpcast.com/~/channel/onthebrink', 'https://warpcast.com/~/channel/piratewires', 'https://warpcast.com/~/channel/moz', 'https://warpcast.com/~/channel/zynwood', 'https://warpcast.com/~/channel/gray', 'https://warpcast.com/~/channel/all-in']
const fids = [249223, 5650, 37, 97, 151, 318610, 319431]
// Ian, Vitalik, Balaji, Nic, Matt, Solana, Ryan

const App: React.FC = () => {
  const [currentChannelIndex, setCurrentChannelIndex] = React.useState<number>(0);
  const [allChannels, setAllChannels] = React.useState<Channel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [showTerminal, setShowTerminal] = useState(false);
  const [searchUsername, setSearchUsername] = useState<string>('');

  const handleArticleClick = (channelIndex: number) => {
    setCurrentChannelIndex(channelIndex);
  };

  const handleSearch = (username: string) => {
    setSearchUsername(username);
    console.log('username: ', username);
  };

  const toggleTerminal = () => {
    setShowTerminal((prevShowTerminal) => !prevShowTerminal);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        toggleTerminal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    <div className="flex flex-col items-center justify-center text-left bg-stone-100">
      <div className="header h-24 md:h-16 items-center w-full relative flex pl-4">
        <div className="absolute left-0 top-0 w-full h-full" onClick={navigateHome}></div>
        <Title />
        <InfoIcon 
          onClick={() => setIsModalOpen(true)}
          aria-label="Information"
          style={{ position: 'absolute', right: 'calc(0.25rem + 1vw)', top: '50%', transform: 'translateY(-50%)', color: '#ffffff', fontSize: 'calc(0.95rem + 1vw)' }}
        />
      </div>
      <NavBar channels={channels} currentChannelIndex={currentChannelIndex} 
              setCurrentChannelIndex={setCurrentChannelIndex}/>
      {showTerminal && (
        <div className="w-10/12 pt-4">
          <TerminalComponent onSearch={handleSearch} />
        </div>
      )}
      <Routes>
        <Route path={'/'} element={<ArticleList channel={channels[currentChannelIndex]} channels={channels} onArticleClick={handleArticleClick} />}/>
        <Route path={'/article/:id'} element={<ArticlePage/>}/>
      </Routes>
      <div className="bg-stone-100 p-4">
        <CastList channel={channels[currentChannelIndex]} searchUsername={searchUsername} />
      </div>
      {isModalOpen && <LatexSourceModal closeModal={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default App;

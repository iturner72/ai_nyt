// App.tsx
import React, { useState, useEffect } from 'react';
import CastList from './components/CastList';
import NavBar from "./components/NavBar";
import axios from "axios";
import {Routes, Route, useNavigate} from "react-router-dom";
import {ArticleList} from "./views/ArticleList/ArticleList";
import ArticlePage from "./views/ArticlePage/ArticlePage";
import InfoIcon from '@mui/icons-material/Info';
import config2 from "./config2";
import TerminalComponent from './components/TerminalComponent';
import { ReactComponent as Title } from './icons/Title.svg';
import LatexSourceModal from './components/LatexSourceModal';
import { AuthKitProvider } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';
import { SignIn } from './components/SignIn';
import MenuIcon from '@mui/icons-material/Menu';
import ProfilePage from './components/ProfilePage';

const currentUrl = window.location.origin;
const siweUri = `${currentUrl}/login`;
const domain = currentUrl.replace(/^https?:\/\//, '');

const config = {
    domain: domain,
    siweUri: siweUri,
    rpcUrl: process.env.OP_MAINNET_RPC_URL,
    relay: 'https://relay.farcaster.xyz',
};

const channels = ['https://warpcast.com/~/channel/networktimes', 'https://warpcast.com/~/channel/piratewires', 'https://warpcast.com/~/channel/moz','https://warpcast.com/~/channel/onthebrink', 'https://warpcast.com/~/channel/gray', 'https://warpcast.com/~/channel/all-in']
const fids = [249223, 5650, 37, 97, 151, 318610, 319431]
// Ian, Vitalik, Balaji, Nic, Matt, Solana, Ryan

const App: React.FC = () => {
  const [currentChannelIndex, setCurrentChannelIndex] = React.useState<number>(0);
  const [allChannels, setAllChannels] = React.useState<Channel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [showTerminal, setShowTerminal] = useState(false);
  const [searchUsername, setSearchUsername] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevIsMobileMenuOpen) => !prevIsMobileMenuOpen);
  };

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
        axios.get(`https://${config2.serverBaseUrl}/channels`).then(res => {
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
  <AuthKitProvider config={config}>
    <div className="flex flex-col items-center justify-center text-left bg-stone-100">
      <div className="header h-24 md:h-20 items-center w-full relative flex pl-4">
        <div className="absolute left-0 top-0 w-7/12 md:w-2/12 h-full cursor-pointer" onClick={navigateHome} ></div>
        <Title />

        <div className="md:hidden">
          <MenuIcon
            onClick={toggleMobileMenu}
            aria-label="Menu"
            style={{ position: 'absolute', right: 'calc(1.25rem + 1vw)', top: '50%', transform: 'translateY(-50%)', color: '#ffffff', fontSize: 'calc(1.75rem + 1vw)' }}
          />
        </div>
        <div className={`signin-wrapper md:hidden ${isMobileMenuOpen ? 'header flex flex-col items-center space-y-4' : 'hidden'}`} style={{ position: 'absolute', top: '70%', right: '0', padding: '1rem', zIndex: '30' }}>
          <InfoIcon
            onClick={() => setIsModalOpen(true)}
            aria-label="Information"
            style={{ color: '#ffffff', fontSize: 'calc(1.95rem + 1vw)' }}
          />
          <SignIn />
        </div>
        <div className="hidden md:block">
          <InfoIcon
            onClick={() => setIsModalOpen(true)}
            aria-label="Information"
            style={{ position: 'absolute', right: 'calc(0.5rem + 0.5vw)', top: '50%', transform: 'translateY(-50%)', color: '#ffffff', fontSize: 'calc(0.55rem + 1vw)' }}
          />
          <div className="signin-wrapper" style={{ position: 'absolute', bottom: '17%', right: 'calc(3.25rem + 1vw)' }}>
            <SignIn />
          </div>
        </div>
      </div>
      <NavBar channels={channels} currentChannelIndex={currentChannelIndex}
        setCurrentChannelIndex={setCurrentChannelIndex} />
      {showTerminal && (
        <div className="w-10/12 pt-4">
          <TerminalComponent onSearch={handleSearch} />
        </div>
      )}
      <Routes>
        <Route path={'/'} element={<ArticleList channel={channels[currentChannelIndex]} channels={channels} onArticleClick={handleArticleClick} />} />
        <Route path={'/article/:id'} element={<ArticlePage />} />
        <Route path={'profile/:fid'} element={<ProfilePage />} />
        <Route path={'/login'} element={<SignIn />} />
      </Routes>
      {isModalOpen && <LatexSourceModal closeModal={() => setIsModalOpen(false)} />}
    </div>
  </AuthKitProvider>
);

}

export default App;

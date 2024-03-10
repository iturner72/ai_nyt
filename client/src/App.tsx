import React, {useEffect} from 'react';
import CastList from './components/CastList';
import NavBar from "./components/NavBar";
import axios from "axios";
import {Routes, Route, useNavigate} from "react-router-dom";
import {ArticleList} from "./views/ArticleList/ArticleList";
import ArticlePage from "./views/ArticlePage/ArticlePage";

const channels = ['https://warpcast.com/~/channel/onthebrink', 'https://warpcast.com/~/channel/gray', 'https://warpcast.com/~/channel/design', 'https://warpcast.com/~/channel/memes']
const fids = [249222, 5650, 37, 97, 151, 318610, 319431]
// Ian, Vitalik, Balaji, Nic, Matt, Solana, Ryan

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://12.0.0.1:8080';

const App: React.FC = () => {
  const [currentChannelIndex, setCurrentChannelIndex] = React.useState<number>(0);
  const [allChannels, setAllChannels] = React.useState<Channel[]>([]);
  const hubble_url = process.env.HUBBLE_URL;
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
        axios.get(`${BACKEND_URL}/channels`).then(res => {
        // axios.get(`${BACKEND_URL}/warpcast/channels`).then(res => {
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
    <div className="text-center bg-stone-100">
      <div
        onClick={navigateHome}
        className={'h-32 relative'}>
        <h1 className={'text-[100px] font-display py-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}>ai_nyt</h1>
      </div>
      <Routes>
        <Route path={'/'} element={<ArticleList/>}/>
        <Route path={'/article/:id'} element={<ArticlePage/>}/>
      </Routes>
      {/*<NavBar channels={channels} currentChannelIndex={currentChannelIndex}*/}
      {/*        setCurrentChannelIndex={setCurrentChannelIndex}/>*/}
      {/*<div className=" bg-stone-200">*/}
      {/*  <CastList channel={channels[currentChannelIndex]}/>*/}
      {/*</div>*/}
    </div>
  );
}

export default App;

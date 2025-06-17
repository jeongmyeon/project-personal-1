import { useState } from 'react'
import './App.css'
import Header from './header-footer/header'
import { Route, Routes } from 'react-router-dom';
import Login from './account/login';
import RegisterModal from './account/register';
import Mypage from './pages/Mypage/Mypage';
import Home from './pages/home';
import Location from './pages/Category/location';
import Board from './pages/Board/board';
import Market from './pages/Market/market';
import BoardWrite from './pages/Board/boardWrite';
import BoardDetail from './pages/Board/boardDetail';
import FindAccount from './account/findaccount';
import MarketForm from './pages/Market/marketform';
import MarketDetail from './pages/Market/marketDetail';
import ChatRoom from './pages/Market/chatRoom';
import ChatHistory from './pages/Mypage/ChatHistory';
import MypageLayout from './pages/Mypage/MypageLayout';
import MyMarket from './pages/Mypage/MyMarket';
import MyBoard from './pages/Mypage/MyBoard';
import MarketEdit from './pages/Market/marketEdit';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  

  return (
    <>
     {<Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
     <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
        <Route path="/register" element={<RegisterModal/>}/>
        <Route path="/location" element={<Location/>}/>
        <Route path="/board" element={<Board/>}/>
        <Route path="/market" element={<Market/>}/>
        <Route path="/market/:id" element={<MarketDetail/>}/>
        <Route path="/market/marketedit/:id" element={<MarketEdit/>}/>
        <Route path="/marketform" element={<MarketForm/>}/>
        <Route path="/chatroom/:roomId" element={<ChatRoom/>}/>
        <Route path="/board/write" element={<BoardWrite/>}/>
        <Route path="/board/:id" element={<BoardDetail/>}/>
        <Route path="/find-account" element={<FindAccount/>}/>
        <Route path='/chat/:roomId' element={<ChatRoom/>}/>
          <Route path="/mypagelayout" element={<MypageLayout/>}>
            <Route path='mypage' element={<Mypage/>}/>
            <Route path='chathistory' element={<ChatHistory/>}/>
            <Route path='mymarket' element={<MyMarket/>}/>
            <Route path='myboard' element={<MyBoard/>}/>
          </Route>
     </Routes>
    </>
  )
}

export default App

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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  

  return (
    <>
     {<Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
     <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
        <Route path="/register" element={<RegisterModal/>}/>
        <Route path="/mypage" element={<Mypage/>}/>
        <Route path="/location" element={<Location/>}/>
        <Route path="/board" element={<Board/>}/>
        <Route path="/market" element={<Market/>}/>
        <Route path="/board/write" element={<BoardWrite/>}/>
        <Route path="/board/:id" element={<BoardDetail/>}/>
        <Route path="/find-account" element={<FindAccount/>}/>
     </Routes>
    </>
  )
}

export default App

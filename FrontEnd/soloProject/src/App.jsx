import { useState } from 'react'
import './App.css'
import Header from './header-footer/header'
import { Route, Routes } from 'react-router-dom';
import Login from './account/login';
import RegisterModal from './account/register';
import Mypage from './pages/Mypage/Mypage';
import Home from './pages/home';

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
     </Routes>
    </>
  )
}

export default App

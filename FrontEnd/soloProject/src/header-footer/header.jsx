import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header.css"
import { useEffect, useState } from "react";

export default function Header({isLoggedIn, setIsLoggedIn}){
    const [isAdmin, setIsAdmin] = useState(false);

    const location = useLocation();
    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const parts = token.split(".");
                if (parts.length !== 3) {
                    throw new Error("잘못된 토큰 형식입니다.");
                }
  
                const base64Payload = parts[1];
                const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
                const decodedPayload = JSON.parse(atob(base64));
                
                
                setIsLoggedIn(true); 
                setIsAdmin(decodedPayload.role === "ROLE_ADMIN");
                
            } catch (error) {
                console.error("토큰 디코딩 오류:", error);
                setIsLoggedIn(false);
                setIsAdmin(false); 
            }
        }else{
            setIsLoggedIn(false); 
            setIsAdmin(false); 
        }
    }, [isLoggedIn,setIsAdmin]);
  
    useEffect(() => {
        if (isLoggedIn) {
            // 이미 로그인된 경우, 새로고침을 한 번만 실행하도록 설정
            const isFirstLoad = sessionStorage.getItem("firstLoad");
            if (!isFirstLoad) {
                sessionStorage.setItem("firstLoad", "true");
                window.location.reload();
            }
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("token"); // 토큰 삭제
        localStorage.removeItem("email");
        setIsLoggedIn(false); 
        setIsAdmin(false);
        navigate('/'); // 메인 페이지로 리다이렉션
    };
    return(
        <div className="header-container">
            <div className="header">
                <div className="header-title">
                    <Link className="title-link" to="/" >
                    <h1>오<span>늘도</span> 클<span>라이밍</span> 완<span>료</span></h1>
                    </Link>
                </div>
                <div className="login">
                    {isLoggedIn ? (
                        <>
                            <button onClick={()=> navigate('/mypage')}>마이페이지</button>
                            <button onClick={handleLogout} className="logout-btn">로그아웃</button>
                        </>
                    ) : (
                        <>
                            <button onClick={()=> navigate('/login')}>로그인</button>
                        </>
                    )}
                </div>
            </div>
            <div className="header-menu">
                <Link to={"/location"} className={`header-category ${location.pathname === "/location" ? "active" : ""}`}>암장위치</Link>
                <Link to={"/board"} className={`header-category ${location.pathname === "/board" ? "active" : ""}`} >게시판</Link>
                <Link to={"/market"} className={`header-category ${location.pathname === "/market" ? "active" : ""}`}>중고장터</Link>
            </div>
        </div>
        
    )
}
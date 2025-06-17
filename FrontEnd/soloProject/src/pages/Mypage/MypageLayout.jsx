import { Link, Outlet } from "react-router-dom";
import '../Mypage/MypageLayout.css';



export default function MypageLayout(){

    return(
        <div className="mypage-container">
            <div className="sidebar">
                <ul>
                    <li><Link to="mypage">내 정보</Link></li>
                    <li><Link to="chathistory">채팅내역</Link></li>
                    <li><Link to="mymarket">작성 거래 게시글</Link></li>
                    <li><Link to="myboard">작성 게시글</Link></li>
                </ul>
            </div>
            <div className="content">
                <Outlet/>
            </div>
        </div>
    )
}
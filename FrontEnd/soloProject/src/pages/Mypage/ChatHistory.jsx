import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import createApi from "../../api/api";
import '../Mypage/ChatHistory.css';
import mypageApi from "../../api/mypageApi";


export default function ChatHistory(){
    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate();

    const api = createApi();
    const mypage = mypageApi(api);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if(!userData){
            navigate("/login");
            return;
        }

        const {id : userId} = JSON.parse(userData);

        mypage.getMyChatRooms(userId)
            .then((res) => {
                setChatRooms(res.data);
            }).catch((err) =>{
                console.error("채팅 목록 실패", err);
            })
    },[navigate]);

    const goToChatRoom = (roomId) => {
        navigate(`/chat/${roomId}`);
    }


    return(
        <div className="chat-history-container">
            <h2>내 채팅방 목록</h2>
            <ul className="chatroom-list">
                {chatRooms.map((room) => (
                    <li key={room.roomId} onClick={() => goToChatRoom(room.roomId)} className={`chatroom-item ${room.unreadCount > 0 ? "unread" : ""}`}>
                        <strong>{room.opponentName}</strong>
                        <p>{room.lastMessage}</p>
                        <span>{new Date(room.updatedAt).toLocaleString()}</span>
                        
                    </li>
                ))}
            </ul>
        </div>

    )
}
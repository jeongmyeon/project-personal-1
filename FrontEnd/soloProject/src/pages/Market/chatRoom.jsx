import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import createApi from "../../api/api";
import marketApi from "../../api/marketApi";
import '../Market/chatRoom.css';



export default function ChatRoom(){
    const {roomId} = useParams();
    const [message, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [receiverId, setReceiverid] = useState('');
    const stompClient = useRef(null);

    const api = createApi();
    const market = marketApi(api);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if(userData){
            const userObj = JSON.parse(userData);
            setUserName(userObj.userName);
            setUserId(userObj.userId);
            setReceiverid(userObj.userId);
        }

    },[]);
    

    useEffect(() => {
        console.log(roomId);
        if(!roomId) return;

        market.getChat(roomId)
            .then(response => {
                setMessages(response.data);
            }).catch(error => {
                console.error("채팅 오류", error);
            })



        setReceiverid(userId);

        const socket = SockJS("http://localhost:8080/ws-chat");
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('STOMP 연결 성공!');

                stompClient.current.subscribe("/queue/message",(msg) => {
                    if(msg.body){
                        const chatMessage = JSON.parse(msg.body);
                        console.log("메세지 수신:",chatMessage);
                        if(chatMessage.roomId === roomId){
                            setMessages((prev) => [...prev, chatMessage]);
                        }
                    }
                });
            },
            onStompError: (frame) => {
                console.log("STOMP 오류: ", frame);
            },
        });

        stompClient.current.activate();

        return () => {
            if(stompClient.current){
                stompClient.current.deactivate();
            }
        };
    },[roomId,userId]);

    const sendMessage = () => {
        if(stompClient.current && stompClient.current.connected && inputMessage.trim() !== ""){
            const chatMessage = {
                roomId: roomId,
                senderId: userId,
                senderName: userName,
                receiverId: receiverId,
                message: inputMessage,
                createdAt: new Date().toISOString(),
            };
            stompClient.current.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify(chatMessage),
            });
            setMessages(prev => [...prev, chatMessage]);
            setInputMessage("");
        }
    };

    return(
        <div className="chatroom-container">
            <h2>채팅방 #{roomId}</h2>
            <div className="message-content">
                {message.map((message,idx) => (
                    <div className="message-date" key={message.id ?? idx}>
                        <p><b>{message.senderName}</b>: {message.message}</p> 
                        <p>{new Date(message.createdAt).toLocaleTimeString()}</p>
                        <p>{new Date(message.createdAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
            <hr/>
            <input type="text" placeholder="메세지를 입력하세요..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === "Enter") sendMessage();
                    }}/>
                    <button onClick={sendMessage} className="message-btn">전송</button>
        </div>
    )
}
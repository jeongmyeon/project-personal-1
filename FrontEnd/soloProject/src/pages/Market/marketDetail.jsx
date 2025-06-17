import { useNavigate, useParams } from "react-router-dom"
import createApi from "../../api/api";
import marketApi from "../../api/marketApi";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import '../Market/marketDetail.css';



export default function MarketDetail(){
    const {id} = useParams();
    const [marketDetail, setMarketDetail] = useState(null);
    const [userId, setUserId] = useState('');

    const navigate = useNavigate();
    const api = createApi();
    const market = marketApi(api);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            try{
                const decoded = jwtDecode(token);
                setUserId(decoded.id);
            }catch(error){
                console.error('토큰 오류 : ' , error);
                setUserId(null);
            }
        }

        market.getMarketDetail(id).then(response => {
            console.log(response.data.market);
            if(response.data.success){
                setMarketDetail(response.data.market);
            }else{
                alert('마켓 정보 로드 실패');
            }
        }).catch(error => {
            console.error('마켓 로드 실패: ', error);
            alert('마켓 로드 실패');
        });
    },[id])

    if(!marketDetail){
        return <div>Loading...</div>;
    }

    const handleChatRoom = () => {
        if(!userId){
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        if(userId === marketDetail.userId){
            alert('자기 자신과 채팅할 수 없습니다.');
            return;
        }

        market.createChatRoom(userId, marketDetail.userId, marketDetail.marketId)
            .then(response => {
                console.log(response.data)
                if(response.data.success){
                    const chatRoomId = response.data.chatRoomId;
                    navigate(`/chatroom/${chatRoomId}`);
                }else{
                    alert('채팅방 생성 실패');
                }
            }).catch(error => {
                console.error(error);
                alert('채팅방 생성 중 오류 발생');
            });
    };

   




    return(
        <div className="marketdetail-main">
            <div className="marketdetail-container">
                <div className="marketdetail-header">
                    <h2>{marketDetail.title} | {marketDetail.price}원</h2>
                    <span><small>{marketDetail.userName} <strong>|</strong> 조회수: {marketDetail.views}</small></span>
                </div>
                <hr/>
                <p><img src={`http://localhost:8080${marketDetail.image}`} alt={marketDetail.image}/></p>
                <p>{marketDetail.content}</p>
            </div>
            <div className="marketdetail-btn-wrapper">
                {userId === marketDetail.userId ? (
                    <button className="marketdetail-btn" onClick={() => navigate(`/market/marketEdit/${marketDetail.marketId}`)}>
                        수정
                    </button>
                ) : (
                    <button className="marketdetail-btn" onClick={handleChatRoom}>채팅하기</button>
                )}
            </div>
        </div>
    )
}
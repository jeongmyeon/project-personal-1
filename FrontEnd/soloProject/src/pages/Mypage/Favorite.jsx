import { useEffect, useState } from "react";
import createApi from "../../api/api"
import marketApi from "../../api/marketApi";
import { useNavigate } from "react-router-dom";
import '../Mypage/favorite.css';



export default function Favorite(){
    const [favorite, setFavorite] = useState([]);

    const api = createApi();
    const market = marketApi(api);
    const navigate = useNavigate();

    useEffect(() =>{
        const token = localStorage.getItem('token');
        if(!token){
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        market.getFavorite()
            .then(response => {
                if(response.data.success){
                    setFavorite(response.data.favorites);
                }else{
                    alert('즐겨찾기 로드 실패');
                }
            }).catch(error =>{
                console.error('즐겨찾기 실패',error);
            });
    },[]);

    const handleClick = (marketId) =>{
        navigate(`/market/${marketId}`);
    }

    const handleDelete = (marketId) => {
        market.deleteFavorite(marketId)
            .then(response => {
                if(response.data.success){
                    setFavorite(prev => prev.filter(item => item.marketId !== marketId));
                }else{
                    alert('삭제 실패');
                }
            }).catch(error => {
                console.error("즐찾 삭제 오류: " ,error);
            })
    }
    return(
        <div className="favorite-container">
            <h2>관심목록</h2>
            {favorite.length === 0 ? (
                <p>즐겨찾기한 목록이 없습니다.</p>
            ) : (
                <div className="favorite-content">
                    <ul>
                        {favorite.map(item => (
                            <li key={item.marketId}>
                                <div className="left" onClick={() => handleClick(item.marketId)}>
                                    <h3>{item.title}</h3>
                                    <p>{item.price}원</p>
                                </div>
                                <div className="right">
                                    <button onClick={() => handleDelete(item.marketId)}>삭제</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
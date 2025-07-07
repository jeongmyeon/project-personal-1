import { useNavigate } from 'react-router-dom';
import '../Market/market.css';
import { useEffect, useState } from 'react';
import createApi from '../../api/api';
import marketApi from '../../api/marketApi';

export default function Market(){
    const [markets, setMarkets] = useState([]);
    const [favorite, setFavorite] = useState(new Set());

    const api = createApi();
    const market = marketApi(api);
    const navigate = useNavigate();
    
    useEffect( () => {
        market.getMarket().then(response => {
            if(response.data.success){
                setMarkets(response.data.market);
            }else{
                alert('마켓 목록 로드 실패');
            }
        }).catch(error => {
            console.error('마켓 목록 오류 : ', error);
            alert('마켓 목록 로드 중 오류 발생');
        })
    },[]);

     const handleWrite = () =>{
        const user = localStorage.getItem('token');
        if(!user){
            alert('로그인이 필요합니다.');
            navigate('/login');
        }else{
            navigate('/marketform');
        }
    };

    useEffect(() =>{
        const token = localStorage.getItem('token');
        if(token){
            market.getFavorite()
                .then(response => {
                    if(response.data.success){
                        const ids = response.data.favorites.map(fav => fav.marketId);
                        setFavorite(new Set(ids));
                    }else{
                        console.log("즐겨찾기 로드 실패");
                    }
                }).catch(error => {
                    console.error("즐찾 목록 오류 : ", error);
                })
        }
    },[])

    const toggleFavorite = (marketId) =>{
        const token = localStorage.getItem('token');
        if(!token){
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }
        if(favorite.has(marketId)){
            market.deleteFavorite(marketId)
                .then(response => {
                    if(response.data.success){
                        const newFavorites = new Set(favorite);
                        newFavorites.delete(marketId);
                        setFavorite(newFavorites);
                    }else{
                        alert('즐겨찾기 삭제 실패');
                    }
                }).catch(error => {
                    console.error("삭제 오류 :" ,error);
                    alert('삭제 오류');
                });
        }else{
            market.addFavorite(marketId)
                .then(response => {
                    if(response.data.success){
                        setFavorite(new Set(favorite).add(marketId));
                    }else{
                        alert('즐겨찾기 추가 실패');
                    }
                }).catch(error =>{
                    console.error('추가 실패 :' , error);
                    alert('추가 실패');
                });
        }
    };




    return(
        <div className='market-container'>
            <div className='notice-wrapper'>
            <div className='market-notice'>
                <div className='notice'>
                    <h2>유의사항</h2>
                    <p>
                        1. 거래 전 물품 상태를 꼭 확인하세요.<br />
                        2. 직거래는 밝은 장소에서 진행하세요.<br />
                        3. 사기 방지를 위해 안전 결제를 이용하세요.<br />
                        4. 개인정보는 상대방에게 과도하게 공개하지 마세요.
                    </p>
                </div>
            </div>
                <button className='write-btn' onClick={handleWrite}>글쓰기</button>
            </div>
            <h2>중고 마켓</h2>
            <div className='product-grid'>
                {markets.map((market) =>{
                    return(
                    <div key={market.marketId} className='product-card' 
                        onClick={() => navigate(`/market/${market.marketId}`)}>
                        <img src={`http://localhost:8080${market.image}`} alt={market.image}/>
                        <h3>{market.title}</h3>
                        <div className='favorite-area'>
                        <p>{market.price}원</p>
                            <button className={`favorite-btn ${favorite.has(market.marketId) ? 'favorited' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(market.marketId);
                                }}
                                aria-label="즐겨찾기 토글">{favorite.has(market.marketId) ? '★' : '☆'}
                            </button>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    );
}
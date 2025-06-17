import { useEffect, useState } from "react"
import createApi from "../../api/api";
import mypageApi from "../../api/mypageApi";
import '../Mypage/MyMarket.css';
import { useNavigate } from "react-router-dom";



export default function MyMarket(){
    const [market, setMarket] = useState([]);


    const api = createApi();
    const mypage = mypageApi(api);
    const navigate = useNavigate();


    useEffect(() => {
        mypage.getMyMarket()
            .then(response => {
                if(response.data.success){
                    setMarket(response.data.market);
                }else{
                    console.error("불러오기 실패",response.data.message);
                }
            }).catch(error =>{
                console.error("에러 발생",error);
            })
    },[]);

    const handleClick = (marketId) => {
        navigate(`/market/${marketId}`)
    }

    const handleDelete = (marketId) => {
        if(window.confirm('정말로 삭제하시겠습니까?')){
            mypage.deleteMarket(marketId)
                .then(response => {
                    if(response.data.success){
                        alert('삭제 되었습니다.');
                        setMarket(prevMarket => prevMarket.filter(item => item.marketId !== marketId));
                    }else{
                        alert('삭제 오류');
                    }
                }).catch(error => {
                    console.error('삭제 오류: ', error);
                    alert('삭제 중 오류 발생');
                });
        }
    }

    return(
        <div className="mymarket-container">
            <h2>내가 작성한 중고거래 목록</h2>
            {market.length === 0 ? (
                <p>작성한 게시글이 없습니다.</p>
            ) : (
                <div className="mymarket-content">
                    <ul>
                        {market.map((item) => (
                            <li key={item.marketId} className="mymarket-item">
                                <div className="market-left"  onClick={() => handleClick(item.marketId)}>
                                    <h3>{item.content}</h3>
                                    <p>조회수 : {item.views}</p>
                                </div>
                                <div className="market-right">
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
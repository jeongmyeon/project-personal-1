import {useEffect, useState } from 'react';
import './home.css';
import createApi from '../api/api';
import marketApi from '../api/marketApi';
import boardApi from '../api/boardApi';
import { useNavigate } from 'react-router-dom';


export default function Home(){
    const [markets, setMarkets] = useState([]);
    const [boards, setBoards] = useState([]);

    const navigate = useNavigate();
    const api = createApi();
    const market = marketApi(api);
    const board = boardApi(api);


    useEffect( () => {
        market.getlatestMarket().then(response => {
            if(response.data.success){
                setMarkets(response.data.market);
            }else{
                alert('최신 마켓 목록 로드 실패');
            }
        }).catch(error => {
            console.error('최신 마켓 목록 오류 : ', error);
            alert('최신 마켓 목록 로드 중 오류 발생');
        })
    },[]); 

    useEffect( () => {
        board.getrecommendBoard().then(response => {
            if(response.data.success){
                setBoards(response.data.board);
            }else{
                alert('추천 게시판 목록 로드 실패');
            }
        }).catch(error => {
            console.error('추천 게시판 목록 오류 : ', error);
            alert('추천 게시판 목록 로드 중 오류 발생');
        })
    },[]);



    return(
        <div className='home-main'>
            <div className='main1-market'>
                <div className='main1-market-title'>마켓</div>
                <div className='main1-market-content'>
                    {markets.map((market) => (
                        <div key={market.marketId} className='main1-market-item'
                        onClick={() => navigate(`/market/${market.marketId}`)}>
                            <img src={`http://localhost:8080${market.image}`} alt={market.title}/>
                            <div>{market.title}</div>
                            <div>{market.price}원</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='main2-board'>
                <div className='main2-board-title'>게시판</div>
                <div className='main2-board-content'>
                    <table className='main2-board-table'>
                        <thead>
                            <tr>
                                <th>작성자</th>
                                <th>제목</th>
                                <th>내용</th>
                                <th>추천수</th>
                            </tr>
                        </thead>
                    <tbody>
                        {boards.slice(0,5).map((board) => (
                            <tr key={board.boardId} onClick={() => navigate(`/board/${board.boardId}`)}>
                                <td>{board.userName}</td>
                                <td>{board.title}</td>
                                <td>{board.content}</td>
                                <td>{board.likes}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
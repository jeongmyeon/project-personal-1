import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import createApi from "../../api/api";
import mypageApi from "../../api/mypageApi";
import '../Mypage/MyBoard.css';


export default function MyBoard(){
    const [board, setBoard] = useState([]);

    const navigate = useNavigate();
    const api = createApi();
    const mypage = mypageApi(api);

    useEffect(() => {
        mypage.getMyBoard()
            .then(response => {
                if(response.data.success){
                    setBoard(response.data.board);
                }else{
                    console.error("불러오기 실패",response.data.message);
                }
            }).catch(error => {
                console.error("에러 발생",error);
            })
    },[]);

    const handleClick = (boardId) => {
        navigate(`/board/${boardId}`)
    }

    const handleDelete = (boardId) => {
        if(window.confirm('정말로 삭제하시겠습니까?')){
            mypage.deleteBoard(boardId)
            .then(response => {
                if(response.data.success){
                    alert('게시글이 삭제되었습니다.');
                    setBoard(prevBoard => prevBoard.filter(item => item.boardId !== boardId));
                } else {
                    alert('게시글 삭제에 실패했습니다.');
                }
            }).catch(error => {
                console.error('게시글 삭제 오류:', error);
                alert('게시글 삭제 중 오류가 발생했습니다.');
            });
        }
    }


    return(
         <div className="myboard-container">
            <h2>내가 작성한 게시글 목록</h2>
            {!board ? (
                <p>작성한 게시글이 없습니다.</p>
            ) : (
                <div className="myboard-content">
                    <ul>
                        {board.map((item) => (
                            <li key={item.boardId}  className="myboard-item">
                                <div className="board-left" onClick={() => handleClick(item.boardId)}>
                                    <h3>{item.title}</h3>
                                    <p>조회수 : {item.views}</p>
                                </div>
                                <div className="board-right">
                                <button onClick={() => handleDelete(item.boardId)}>삭제</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
import { useEffect, useState } from "react";
import '../Board/board.css'; 
import { useNavigate } from "react-router-dom";
import createApi from "../../api/api";
import boardApi from "../../api/boardApi";


export default function Board(){
    const [boards, setBoards] = useState([]);
    const navigate = useNavigate();
    const api = createApi();
    const board = boardApi(api);

    useEffect(() => {
        board.getBoards().then(response => {
            if(response.data.success){
                setBoards(response.data.boards);
            } else {
                alert('게시글을 불러오는 데 실패했습니다.');
            }
        }).catch(error => {
            console.error('게시글 불러오기 오류:', error);
            alert('게시글을 불러오는 중 오류가 발생했습니다.');
        });
    },[])

    return(
        <div>
            <div className="board-main">
                <h1>게시판</h1>
                <table className="board-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boards.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}> 게시글이 없습니다.</td>
                            </tr>
                        ) : (
                            boards.map((board, index) => (
                                <tr key={board.boardId}
                                onClick={()=> navigate(`/board/${board.boardId}`)}
                                    style={{ cursor: 'pointer' }}>
                                    <td>{index + 1}</td>
                                    <td>{board.title}</td>
                                    <td>{board.userName}</td>
                                    <td>{board.createdAt}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="board-register">
                    <button className="board-register-btn" onClick={() => navigate('/board/write')}>글쓰기</button>
                </div>    
            </div>
        </div>
    )
}
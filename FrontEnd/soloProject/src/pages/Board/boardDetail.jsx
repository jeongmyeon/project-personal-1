import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import createApi from "../../api/api";
import boardApi from "../../api/boardApi";
import './boardDetail.css';
import { jwtDecode } from "jwt-decode";


export default function BoardDetail(){
    const {id} = useParams();
    const [boardDetail, setBoardDetail] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [userId, setUserId] = useState(null);
    const api = createApi();
    const board = boardApi(api);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            try{
                const decoded = jwtDecode(token);
                console.log("decoded:", decoded); 
                console.log("decoded.userId:", decoded.userId)
                setUserId(decoded.id);
            }catch(error){
                console.error('토큰 디코딩 오류:', error);
                setUserId(null);
            }
        }
        board.getBoardDetail(id).then(response => {
            if(response.data.success){
                setBoardDetail(response.data.board);
                setEditedTitle(response.data.board.title);
                setEditedContent(response.data.board.content);
            } else {
                alert('게시글을 불러오는 데 실패했습니다.');
            }
        }).catch(error => {
            console.error('게시글 불러오기 오류:', error);
            alert('게시글을 불러오는 중 오류가 발생했습니다.');
        });
    }, [id]);

    if(!boardDetail) {
        return <div>Loading...</div>;
    }   

    const isOwner = userId === boardDetail.userId;

    const handleEdit = () => {
        setIsEdit(true);
    };

    const handleCancelEdit = () => {
        setEditedTitle(boardDetail.title);
        setEditedContent(boardDetail.content);
        setIsEdit(false);
    }

    const handleSaveEdit = () => {
        const updatedBoard = {
            boardId: boardDetail.boardId,
            title: editedTitle,
            content: editedContent,
        };

        board.updateBoard(id, updatedBoard).then(response => {
            if(response.data.success){
                alert('게시글이 수정되었습니다.');
                setIsEdit(false);
                setBoardDetail(prev => ({
                    ...prev,
                    title: editedTitle,
                    content: editedContent
                }));
                setIsEdit(false);
            } else {
                alert('게시글 수정에 실패했습니다.');
            }
        }).catch(error => {
            console.error('게시글 수정 오류:', error);
            alert('게시글 수정 중 오류가 발생했습니다.');
        });
    }


    const handleDelete = (boardId) => {
        if(window.confirm('정말로 삭제하시겠습니까?')){
            board.deleteBoard(boardId).then(response => {
                if(response.data.success){
                    alert('게시글이 삭제되었습니다.');
                    window.location.href = '/board';
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
        <div className="board-detail-container">
            {isEdit ? (
                <>
                <input className="board-detail-title-edit"
                value={editedTitle}
                onChange={(e)=> setEditedTitle(e.target.value)}/>
                <div className="board-detail-header">
                    <p>작성자:  {boardDetail.userName}</p>
                    <p>작성일: {boardDetail.createdAt}</p>
                    <p>조회수: {boardDetail.views}</p>
                </div>
                <hr/>
                <textarea className="board-detail-content-edit"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)} />
                <div className="board-detail-btn">
                    <button onClick={handleSaveEdit}>저장</button>
                    <button onClick={handleCancelEdit}>취소</button>
                </div>
                </>
        ):(
            <>
            <h2 className="board-detail-title">{boardDetail.title}</h2>
            <div className="board-detail-header">
            <p>작성자 : {boardDetail.userName}</p>
            <p>조회수 : {boardDetail.views}</p>
            <p>작성일 : {boardDetail.createdAt}</p>
            </div>
            <hr/>
            <div className="board-detail-content">
            <p>{boardDetail.content}</p>
            </div>
            {isOwner && (
            <div className="board-detail-btn">
                <button onClick={() => handleEdit(boardDetail.boardId)}>수정</button>
                <button onClick={() => handleDelete(boardDetail.boardId)}>삭제</button>
            </div>
            )}
            </>
            )}
        </div>
    )
}
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
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [editedReviewId, setEditedReviewId] = useState(null);
    const [editedReviewText, setEditedReviewText] = useState('');

    const api = createApi();
    const board = boardApi(api);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
            try{
                const decoded = jwtDecode(token);
                console.log("decoded:", decoded); 
                setUserId(decoded.id);
            }catch(error){
                console.error('토큰 디코딩 오류:', error);
                setUserId(null);
            }
        }

        // 게시글
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
        
        // 리뷰
        board.getReviews(id).then(response => {
            if(response.data.success){
                setReviews(response.data.reviews);
            }else{
                console.error("리뷰를 불러오는데 실패했습니다.");
            }
        }).catch(error => {
            console.error("리뷰 불러오기 오류", error);
        })
    }, [id]);

    if(!boardDetail) {
        return <div>Loading...</div>;
    }   

    const isOwner = userId === boardDetail.userId;

    const handleEdit = () => setIsEdit(true);

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

    const handleAddReview = () => {
        if(newReview.trim() === ''){
            alert('리뷰를 입력해주세요');
            return;
        }
        board.addReview(id, {reviewText : newReview}).then(response => {
            if(response.data.success){
                setNewReview('');
                return board.getReviews(id);
            }else{
                throw new Error('리뷰 등록 실패');
            }
        }).then(res => {
            if(res.data.success){
                setReviews(res.data.reviews);
            }
        }).catch(error => {
            console.error('리뷰 등록 오류:' , error);
            alert('리뷰 등록 중 오류 발생');
        });
    }

    const handleEditReview = (reviewId, currentText) => {
        setEditedReviewId(reviewId);
        setEditedReviewText(currentText);
    }

    const handleCancelEditReview  = () => {
        setEditedReviewId(null);
        setEditedReviewText('');
    }

    const handleSaveEditedReview = (editedReviewId) => {
        if(editedReviewText.trim() === ''){
            alert('리뷰를 입력하세요');
            return;
        }

        board.updateReview(editedReviewId, {reviewText: editedReviewText})
            .then((res) => {
                if(res.data.success){
                    alert('리뷰가 수정되었습니다.');
                    setEditedReviewId(null);
                    return board.getReviews(id);
                }else{
                    throw new Error('리뷰 수정 실패');
                }
            })
            .then((res) => {
                if(res.data.success){
                    setReviews(res.data.reviews);
                }
            }).catch((error) => {
                console.error('리뷰 수정 오류 :'+ error);
                alert('리뷰 수정 중 오류 발생!');
            })
    }

    const handleDeleteReview = (reviewId) => {
        if(!window.confirm('리뷰를 삭제하시겠습니까?')) return;

        board.deleteReview(reviewId)
            .then((res) => {
                if(res.data.success){
                    alert('리뷰가 삭제되었습니다.');
                    return board.getReviews(id)
                }else{
                    throw new Error('리뷰 삭제 실패');
                }
            })
            .then((res) => {
                if(res.data.success){
                    setReviews(res.data.reviews);
                }
            }).catch((error) => {
                console.error('리뷰 삭제 오류 : ' + error);
                alert('리뷰 삭제 중 오류 발생');
            })
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
            <hr/>
            <div className="board-review">
                {reviews.length == 0 ? (
                    <p>등록된 리뷰가 없습니다.</p>
                ) : (
                    <ul className="review-list">
                        {reviews.map((review) =>(
                            <li key={review.reviewId} className="review-item">
                                <div className="review-header">
                            
                                    <strong className="review-name">{review.userName}</strong>
                                    <small className="review-date">{review.createdAt}</small>
                                
                                </div>
                                {editedReviewId === review.reviewId ? (
                                    <>
                                        <textarea
                                            value={editedReviewText}
                                            onChange={(e) => setEditedReviewText(e.target.value)}
                                            rows={3}/>
                                    <button onClick={ () => handleSaveEditedReview(review.reviewId)}>저장</button>
                                    <button onClick={handleCancelEditReview}>취소</button>
                                    </>
                                ) : (
                                    <>
                                        <p className="review-text">{review.reviewText}</p>
                                        {userId === review.userId && (
                                            <div className="review-action">
                                                <button onClick={() => handleEditReview(review.reviewId, review.reviewText)}>수정</button>
                                                <button onClick={() => handleDeleteReview(review.reviewId)}>삭제</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                {userId ? (
                    <div className="review-form">
                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="리뷰를 작성해주세요"
                            rows={3}/>
                            <button onClick={handleAddReview}>등록</button>
                    </div>
                ) : (
                    <p>로그인 후 리뷰를 작성할 수 있습니다.</p>
                )}
            </div>
        </div>
    )
}
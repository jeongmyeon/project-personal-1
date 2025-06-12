import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import boardApi from "../../api/boardApi";
import createApi from "../../api/api";
import './boardwrite.css';




export default function BoardWrite(){
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const api = createApi();
    const board = boardApi(api);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if(!user){
            alert('로그인이 필요합니다.');
            navigate('/login');
        }
    },[]);

    const handleSubmit = (e) =>{
        e.preventDefault();

        board.writeBoard({ title, content})
        .then(response => {
            if(response.data.success){
                alert('게시글이 등록되었습니다.');
                navigate('/board');
            } else {
                alert('게시글 등록에 실패했습니다.');
            }
        })
        .catch(() => {
            alert('게시글 등록 중 오류가 발생했습니다.');
        });
    }

    
    return(
        <div className="board-write-container">
            <h2 className="board-write-header">게시글 작성</h2>
            <hr/>
            <form onSubmit={handleSubmit}>
                <div className="board-write-form-group">
                    <label>제목</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div className="board-write-form-group">
                    <label>내용</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                    />
                </div>
                <button className="board-write-register" type="submit">등록하기</button>
                </form>
        </div>
    )
}
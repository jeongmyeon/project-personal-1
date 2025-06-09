import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import "./Mypage.css";
import createApi from "../../api/api";
import userApi from "../../api/userApi";




export default function Mypage(){
    const [users, setUsers] = useState({});
    const navigate = useNavigate();
    
    const api = createApi();
    const user = userApi(api);

    useEffect(()=> {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        if(!token){
            navigate('/login');
        }

        const getUserData = async() =>{
            try{
                const res = await user.getMyInfo(email);
                console.log("백엔드 응답 데이터:", res.data); 
                setUsers(res.data);
            }catch(error){
                console.error("사용자 정보 불러오기 실패: ",error);
                navigate('/login');
            }
        };

        getUserData();
    },[navigate])




    return(
        <div className="mypage-container">
            <div className="sidebar">
                <ul>
                    <li><a href="/mypage">내 정보</a></li>
                    <li><a href="/mypage/orders">주문 내역</a></li>
                    <li><a href="/mypage/settings">설정</a></li>
                    {/* 다른 페이지 링크 추가 가능 */}
                </ul>
            </div>
            <div className="main-content">
                <h1>마이페이지</h1>
                <div className="user-info">
                    <p><strong>이름:</strong> {users.userName}</p>
                    <p><strong>이메일:</strong> {users.email}</p>
                    <p><strong>휴대폰:</strong> {users.phoneNumber}</p>
                    {/* 추가적인 사용자 정보 표시 가능 */}
                </div>
            </div>
        </div>
    )
}
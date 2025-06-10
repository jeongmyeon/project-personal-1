import { useEffect } from "react";
import { useState } from "react";
import RegisterModal from "./register";
import { useNavigate } from "react-router-dom";
import '../account/login.css';
import userApi from "../api/userApi";
import createApi from "../api/api";



export default function Login({setIsLoggedIn}){
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const api = createApi();
    const user = userApi(api);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if(user && user.role === "ROLE_ADMIN"){
            console.log("관리자 감지됨,자동이동");
            navigate("/admin");
        }
    },[]);

    const handleLogin = async() => {
        try{
            const response = await user.login({email, password});

            console.log("로그인 응답", response.data);

            const userRole = response.data.user.role.trim().toUpperCase();
            localStorage.setItem("token",response.data.token);
            localStorage.setItem("email",response.data.user.email);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            setIsLoggedIn(true);
            alert("로그인 성공");

            if(userRole === "ROLE_ADMIN" || userRole === "ADMIN"){
                navigate("/admin");
            }else{
                navigate("/");
            }
        }catch(error){
            console.error("로그인 실패",error);
            alert("로그인 실패");
        }
    };

    return(
        <div className="login-container">
            <h1 className="big-title">로그인</h1>
            <div className="login-box">
                <label className="login-label">ID</label>
                <input type="text"
                       placeholder="아이디"
                       className="login-input"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}/>
                <label className="login-label">비밀번호</label>
                <input type="password"
                       placeholder="비밀번호"
                       className="login-input"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
            <div className="log-but-con">
                <button className="login-button" onClick={handleLogin}>로그인</button>
                <button className="registers-button" onClick={() => setIsRegisterOpen(true)}>회원가입</button>
            </div>
            <div className="finds-button" onClick={()=>navigate("/find-account")}>아이디 | 비밀번호 찾기</div>
            </div>
            {isRegisterOpen && <RegisterModal onClose={()=> setIsRegisterOpen(false)}/>}
        </div>
    )
}


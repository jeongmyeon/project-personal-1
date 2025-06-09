import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import createApi from "../api/api";
import userApi from "../../src/api/userApi";
import "../account/findaccount.css";


export default function FindAccount(){
    const [activeTab, setActiveTab] = useState("find-id");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showResetModal, setShowResetModal] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    
    const navigate = useNavigate();
    const api = createApi();
    const user = userApi(api);

    const handlePhoneNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // 숫자만 입력
        if (value.length > 3 && value.length <= 7) {
            value = value.replace(/(\d{3})(\d+)/, "$1-$2");
        } else if (value.length > 7) {
            value = value.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
        }
    setPhoneNumber(value);
  };

    const handleFindId = async () => {
        try{
            const reponse = await user.findUserId(name, phoneNumber);
            alert(`아이디 : ${reponse.data.userId}`);
        }catch(error){
            alert("아이디 찾기 실패");
        }
    };

    const handleSendCode = async () => {
        try{
            await user.sendVerificationCode(email, phoneNumber);
            alert("인증번호가 전송되었습니다.");
            setIsCodeSent(true);
        }catch(error){
            alert("인증번호 전송 실패");
        }
    };
    
    const handleVerifyCode = async () => {
        try{
            await user.confirmEmail(email, verificationCode);
            alert("인증번호가 확인되었습니다.");
            setIsVerified(true);
            setShowResetModal(true);
        }catch(error){
            alert("인증번호 확인 실패");
        }
    };

    const handleResetPassword = async () => {
        if(newPassword !== confirmNewPassword){
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try{
            await user.resetPassword({email, newPassword});
            alert("비밀번호가 성공적으로 변경되었습니다.");
            setShowResetModal(false);
            navigate("/login");

            setEmail("");
            setNewPassword("");
            setConfirmNewPassword("");
            setVerificationCode("");
            setIsCodeSent(false);
            setIsVerified(false);
        }catch(error){
            alert("비밀번호 재설정에 실패했습니다.");
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setName("");
        setEmail("");
        setPhoneNumber("");
        setVerificationCode("");
        setIsCodeSent(false);
        setIsVerified(false);
        setNewPassword("");
        setConfirmNewPassword("");
        setShowResetModal(false);
    }

    return(
        <div className="find-account-container">
            <h1 className ="big-title"> Find ID / PassWord</h1>
            <div className="tabs">
                <button className={`tab-button ${activeTab === "find-id" ? "active" : "none"}`}
                        onClick={() => handleTabChange("find-id")}>
                            아이디 찾기
                </button>
                <button className={`tab-button ${activeTab === "find-password" ? "active" : "none"}`}
                        onClick={() => handleTabChange("find-password")}>
                            비밀번호 찾기
                </button>
            </div>

            {activeTab === "find-id" && (
                <div className="tab-content">
                    <label className="login-label">이름</label>
                    <input type="text" className="login-input" value={name} onChange={(e) => setName(e.target.value)} />
                    <label className="login-label">휴대폰 번호</label>
                    <input type="text" className="login-input" value={phoneNumber} onChange={handlePhoneNumberChange} maxLength="13" />
                    <button className="find-button" onClick={handleFindId}>아이디 찾기</button>
                </div>
            )}

            {activeTab === "find-password" && (
                <div className="tab-content">
                    <label className="login-label">아이디</label>
                    <input type="text" className="login-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label className="login-label">휴대폰 번호</label>
                    <input type="text" className="login-input" value={phoneNumber} onChange={handlePhoneNumberChange} maxLength="13" />
                    {!isCodeSent && (
                        <button className="find-button" onClick={handleSendCode}>인증번호 받기</button>
                    )}
                    {isCodeSent && (
                        <>
                            <label className="login-label">인증번호</label>
                            <input type="text" className="login-input" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}/>
                            <button className="find-button" onClick={handleVerifyCode}>인증번호 확인</button>
                        </>
                    )}
                </div>
            )}

            {showResetModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">비밀번호 재설정</h2>
                        <input type="password" className="login-input" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <input type="password" className="login-input" placeholder="새 비밀번호 확인" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />

                        <button className="find-button" onClick={handleResetPassword}>비밀번호 변경</button>
                        <button className="find-button" onClick={() => setshowResetModal(false)}>취소</button>
                    </div>
                </div>
            )}
        </div>
    )
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import indexApi from "../api";

export default function RegisterModal({ onClose }) {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);

    const api = indexApi().userApi; 

    const [errors, setErrors] = useState({
        email: "",
        code: "",
        phoneNumber: "",
        name: "",
        password: "",
        confirmPassword: "",
        isCodeConfirmed,
    });

    useEffect(() => {
        console.log("error 상태 확인", errors);
    }, [errors]);

    const checkEmailExists = async (email) => {
        console.log("이메일 중복 확인 요청 : ", email);
        if (!email.includes("@") || !email.includes(".")) {
            setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }));
            setIsEmailValid(false);
            return;
        }
        try {
            const response = await api.checkEmailExists(email);
            console.log("이메일 중복 확인 응답 : ", response.data);
            if (response.data.exists) {
                setErrors((prev) => ({ ...prev, email: "이미 사용 중인 이메일입니다." }));
                setIsEmailValid(false);
            } else {
                setErrors((prev) => ({ ...prev, email: "" }));
                setIsEmailValid(true);
            }
        } catch (error) {
            console.error("이메일 확인 중 오류 :", error);
            setErrors((prev) => ({ ...prev, email: "이메일 확인 중 오류 발생" }));
            setIsEmailValid(false);
        }
    };

    const sendVerificationCode = async () => {
        if (!email) {
            setErrors((prev) => ({ ...prev, email: "이메일을 입력하시오" }));
            return;
        }
        try {
            await api.verifyEmail(email);
            setIsCodeSent(true);
            alert("인증번호가 전송되었습니다.");
        } catch (error) {
            setErrors((prev) => ({ ...prev, email: "인증번호 전송 실패" }));
        }
    };

    const confirmVerificationCode = async () => {
        if (!code) {
            setErrors((prev) => ({ ...prev, code: "인증번호를 입력하세요" }));
            return;
        }

        try {
            const response = await api.confirmEmail(email, code);

            if (typeof response.data === "string" && response.data.includes("successfully")) {
                setIsCodeConfirmed(true);
                setErrors((prev) => ({ ...prev, code: "" }));
                console.log("인증성공");
                alert("인증 성공");
            } else {
                setErrors((prev) => ({ ...prev, code: "인증번호가 올바르지 않습니다." }));
            }
        } catch (error) {
            console.error("인증번호 확인 중 오류");
            setErrors((prev) => ({ ...prev, code: "인증 확인 중 오류 발생" }));
        }
    };

    const handlePhoneNumberChange = (e) => {
        let input = e.target.value.replace(/[^0-9]/g, "");
        if (input.length > 11) return;

        if (input.length !== 11) {
            setErrors((prev) => ({ ...prev, phoneNumber: "올바른 전화번호 형식이 아닙니다." }));
        } else {
            setErrors((prev) => ({ ...prev, phoneNumber: "" }));
        }

        let formattedNumber = input;
        if (input.length >= 4 && input.length < 8) {
            formattedNumber = `${input.slice(0, 3)}-${input.slice(3)}`;
        } else if (input.length >= 8) {
            formattedNumber = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`;
        }

        setPhoneNumber(formattedNumber);

        if (input.length === 11) {
            checkPhoneExists(formattedNumber);
        }
    };

    const checkPhoneExists = async (phoneNumber) => {
        const formattedPhone = phoneNumber.replace(/-/g, "");
        console.log("휴대폰 번호 중복 확인 요청", formattedPhone);

        try {
            const response = await api.checkPhoneExists(formattedPhone);

            if (typeof response.data === "boolean") {
                console.log("중복 체크 결과:", response.data);

                setErrors((prev) => ({
                    ...prev,
                    phoneNumber: response.data ? "이미 사용중인 전화번호입니다." : "",
                }));

                setTimeout(() => {
                    setErrors((prev) => ({ ...prev }));
                }, 50);
            } else {
                console.log("백엔드 에러");
                setErrors((prev) => ({ ...prev, phoneNumber: "번호 확인 중 오류 발생" }));
            }
        } catch (error) {
            console.error("휴대폰 중복 확인 오류 :", error);
            setErrors((prev) => ({ ...prev, phoneNumber: "번호 확인 중 오류 발생" }));
        }
    };

    const handleRegister = async () => {
        console.log("회원가입 요청 데이터", {
            email,
            name,
            phoneNumber,
            password,
            isVerified: isCodeConfirmed,
        });

        try {
            const formData = new FormData();

            const userData = {
                email,
                name,
                phoneNumber,
                password,
                isVerified: isCodeConfirmed,
            };

            const userBlob = new Blob([JSON.stringify(userData)], { type: "application/json" });
            formData.append("user", userBlob);

            const response = await api.register(formData);
            console.log("회원가입 응답", response.data);
            alert("회원가입 성공");
            onClose();
        } catch (error) {
            console.error("회원가입 실패");
            alert("회원가입 실패, 다시 시도해주세요");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="register-modal">
                <button className="close-button" onClick={onClose}>X</button>
                <h1 className="big-title">회원가입</h1>
                <div className="modals-content">
                    <label className="login-label">이름</label>
                    <input
                    type="text"
                    className="login2-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    />
                    <label className="login-label">이메일</label>
                    <div className="input-row">
                        <input
                            type="email"
                            className="login2-input"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                checkEmailExists(e.target.value);
                            }}
                        />
                        {isEmailValid && (
                            <button className="button-primary" onClick={sendVerificationCode}>인증번호 전송</button>
                        )}
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>
                    {isCodeSent && (
                        <>
                            <label className="login-label">인증번호</label>
                            <div className="input-row">
                                <input
                                    type="text"
                                    className="login2-input"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <button className="button-primary" onClick={confirmVerificationCode}>인증번호 확인</button>
                                {errors.code && <p className="error-text">{errors.code}</p>}
                            </div>
                        </>
                    )}
                    <label className="login-label">비밀번호</label>
                    <input
                        type="password"
                        className="login2-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="login-label">비밀번호 확인</label>
                    <input
                        type="password"
                        className="login2-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <label className="login-label">휴대폰 번호</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className="login2-input"
                    />
                    {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
                    <button className="button-primary" onClick={handleRegister}>회원가입</button>
                </div>
            </div>
        </div>
    );
}

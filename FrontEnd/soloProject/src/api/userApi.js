


export default function userApi(api){
    return{
    checkEmailExists : (email) => api.get(`/user/check-email?email=${email}`),

    checkPhoneExists : (phoneNumber) => api.get(`/user/check-phone?phoneNumber=${phoneNumber}`),

    register(formData){
        return api.post("/user/register",formData,{
            headers:{
                "Content-Type":"multipart/form-data",
            },
        });
    },

    login : (credentials) => api.post("/user/login",credentials),

    verifyEmail : (email) => api.post("/user/verify-email",{email}),

    confirmEmail : (email,code) =>api.post("/user/confirm-email",{email,code}),

    findUserId : (name, phoneNumber) => api.post("/user/find-id",{name,phoneNumber}),

    sendVerificationCode : (email,phoneNumber) => api.post("/user/send-verification-code",{email, phoneNumber}),

    resetPassword : (data) => api.post("/user/reset-password",data),

    getMyInfo: (email) => api.get(`/user/get-user?email=${email}`)
}
};
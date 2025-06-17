




export default function mypageApi(api){


    return{
        getMyChatRooms : (userId) => api.get(`/chat/chatroom?userId=${userId}`),
        getMyMarket : () => api.get(`/mypage/getmarket`),
        getMyBoard : () => api.get(`/mypage/getboard`),
        deleteBoard: (boardId) => api.delete(`/board/delete/${boardId}`),
        deleteMarket : (marketId) => api.delete(`/market/delete/${marketId}`)
    }
}
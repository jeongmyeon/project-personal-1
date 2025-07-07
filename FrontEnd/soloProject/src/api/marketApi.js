


export default function marketApi(api){


    return{
        getMarket : () => api.get(`/market/get`),
        addMarket : (data) => {
            const formData = new FormData();
            formData.append("title",data.title);
            formData.append("content",data.content);
            formData.append("price",data.price);
            if(data.imageFile){
                formData.append("image", data.imageFile);
            }
            return api.post(`/market/add`,formData)
        },
        getMarketDetail : (marketId) => api.get(`/market/${marketId}`),
        createChatRoom : (buyerId, sellerId, marketId) => api.post(`/chatroom`,{buyerId, sellerId,marketId}),
        getChat : (chatRoomId) => api.get(`/chat/room/${chatRoomId}/messages`),
        updateMarket : (marketId,data) => api.put(`/market/edit/${marketId}`,data),
        getFavorite: () => api.get(`/market/favorite/get`),
        addFavorite: (marketId) => api.post(`/market/favorite/add/${marketId}`),
        deleteFavorite: (marketId) => api.delete(`/market/favorite/delete/${marketId}`),
        getlatestMarket: () => api.get(`/market/latest`),
    }
}
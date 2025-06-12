

export default function boardApi(api){

    return{
        getBoards: () => api.get('/board/get'),
        writeBoard: (data) => api.post('/board/write', data),
        getBoardDetail: (boardId) => api.get(`/board/${boardId}`),
        deleteBoard: (boardId) => api.delete(`/board/delete/${boardId}`),
        updateBoard: (boardId, data) => api.put(`/board/edit/${boardId}`, data),
        getReviews: (boardId) => api.get(`/board/review/${boardId}`),
        addReview: (boardId,data) => api.post(`/board/review/add/${boardId}`,data),
        deleteReview: (reviewId) => api.delete(`/board/review/${reviewId}`),
        updateReview : (reviewId,data) => api.put(`/board/review/${reviewId}`,data),
    }
}
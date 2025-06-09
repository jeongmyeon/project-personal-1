

export default function boardApi(api){

    return{
        getBoards: () => api.get('/board/get'),
        writeBoard: (data) => api.post('/board/write', data),
        getBoardDetail: (boardId) => api.get(`/board/${boardId}`),
        deleteBoard: (boardId) => api.delete(`/board/delete/${boardId}`),
        updateBoard: (boardId, data) => api.put(`/board/edit/${boardId}`, data),
    }
}
import createApi from "./api"; 
import boardApi from "./boardApi";

import userApi from "./userApi";  

export default function indexApi() {
    const axiosApi = createApi(); 
    
    
    const user = userApi(axiosApi);
    const board = boardApi(axiosApi);
    
    return {
        userApi: user,
        boardApi: board,  
    };
}

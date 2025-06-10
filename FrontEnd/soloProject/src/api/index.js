import createApi from "./api"; 
import boardApi from "./boardApi";
import locationApi from "./locationApi";

import userApi from "./userApi";  

export default function indexApi() {
    const axiosApi = createApi(); 
    
    
    const user = userApi(axiosApi);
    const board = boardApi(axiosApi);
    const location = locationApi(axiosApi);

    return {
        userApi: user,
        boardApi: board,  
        locationApi: location,
    };
}

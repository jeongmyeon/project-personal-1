

export default function locationApi(api) {

    return{
        getlocation : () => api.get(`/location/get`),
        getroute : (start, end) => {
            return api.get(`/location/route`, {
                params: {
                    start : start,
                    end : end
                }
            });
        },


    };
};
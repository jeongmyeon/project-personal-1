import { useEffect, useRef } from "react";
import createApi from "../../api/api";
import locationApi from "../../api/locationApi";
import "../Category/location.css"


export default function Location(){
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const polylineRef = useRef(null);
    const currentLatRef = useRef(0);
    const currentLngRef = useRef(0);

    const api = createApi();
    const locationAPI = locationApi(api);
    console.log("locationAPI", locationAPI);
    

    useEffect( () => {
        const loadKakaoMap = () => {
            const container = mapRef.current;
            const options = {
                center : new window.kakao.maps.LatLng(37.5665, 126.978),
                level : 6,
            };
            mapInstance.current = new window.kakao.maps.Map(container, options);
            const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
            const imageSize = new window.kakao.maps.Size(20,25);
            const markerImage = new window.kakao.maps.MarkerImage(imageSrc,imageSize);

            const currentImageSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iOCIgc3R5bGU9ImZpbGw6cmVkOyIgLz48L3N2Zz4=";
            const currentImageSize = new window.kakao.maps.Size(13,13);
            const currentMarkerImage = new window.kakao.maps.MarkerImage(currentImageSrc, currentImageSize);

           

            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        currentLatRef.current = lat;
                        currentLngRef.current = lng;
                        console.log("위도:", lat, "경도:", lng);
                        const locPosition = new window.kakao.maps.LatLng(lat, lng);

                        mapInstance.current.setCenter(locPosition);

                        const marker = new window.kakao.maps.Marker({
                            position : locPosition,
                            image : currentMarkerImage,
                        });
                        marker.setMap(mapInstance.current);
                    },
                    (error) => {
                        console.error("현재위치 가져오기 실패!", error);
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 5000,
                    }
                );
            }else{
                console.error("GPS 지원 실패!");
            }
            
            locationAPI.getlocation()
            .then(res => {
                const locations = res.data;
                const infowindow = new window.kakao.maps.InfoWindow({removable: true});


                locations.forEach(loc => {
                    const position = new window.kakao.maps.LatLng(loc.latitude, loc.longitude);
                    const marker = new window.kakao.maps.Marker({
                        position,
                        image: markerImage,
                    });

                    window.kakao.maps.event.addListener(marker, 'click', () => {
                        infowindow.open(mapInstance.current,marker);

                        const origin = new window.kakao.maps.LatLng(currentLatRef.current, currentLngRef.current);
                        const destination = new window.kakao.maps.LatLng(loc.latitude, loc.longitude);
                        
                        if(polylineRef.current){
                            polylineRef.current.setMap(null);
                        }
                   
                        const polyline = new window.kakao.maps.Polyline({
                            path : [origin, destination],
                            strokeWeight : 4,
                            strokeColor : '#FF0000',
                            strokeOpacity : 0.8,
                            strokeStyle : 'solid',
                        });
                        
                        polyline.setMap(mapInstance.current);
                        polylineRef.current = polyline;

                       locationAPI.getroute(
                        `${currentLatRef.current},${currentLngRef.current}`,
                        `${loc.latitude},${loc.longitude}`
                       )
                       .then(res => {
                        const data = res.data;
                        if(data.routes && data.routes.length > 0){
                            const summary = data.routes[0].summary;
                            const distance = (summary.distance / 1000).toFixed(2);
                            const duration = Math.round(summary.duration / 60);

                            const sections = data.routes[0].sections;
                            const routePoints = [];

                            sections.forEach(section => {
                                section.roads.forEach(road => {
                                    road.vertexes.forEach((v,idx) => {
                                        if(idx % 2 === 0){
                                            const lng = v;
                                            const lat = road.vertexes[idx + 1];
                                            routePoints.push(new window.kakao.maps.LatLng(lat,lng));
                                        }
                                    });
                                });
                            });

                            if(polylineRef.current){
                                polylineRef.current.setMap(null);
                            }

                            const polyline = new window.kakao.maps.Polyline({
                                path: routePoints,
                                strokeWeight: 4,
                                strokeColor: '#FF0000',
                                strokeOpacity: 0.8,
                                strokeStyle: 'solid',
                            }); 
                            polyline.setMap(mapInstance.current);
                            polylineRef.current = polyline;

                            infowindow.setContent(`
                                <div style="padding:4px; font-size:12px;">
                                <strong>${loc.name}</strong><br/>
                                도보거리 : ${distance}km<br/>
                                소요시간 : ${duration}분
                                </div>`);
                                infowindow.open(mapInstance.current, marker);
                        }else{
                            console.error("경로 정보가 없습니다.",data);
                        }
                       })
                       .catch(error => {
                        console.error("경로 정보 실패!",error);
                       })
                    })

                    marker.setMap(mapInstance.current);
                });
            }).catch(err => {
                console.error("위치 데이터 가져오기 실패", err);
            })
        };
            
        if(window.kakao && window.kakao.maps){
            loadKakaoMap();
        }else{
            const script = document.createElement("script");
            script.src= "https://dapi.kakao.com/v2/maps/sdk.js?appkey=09060cec02d808cba5e8841f2a3b875d&autoload=false";
            script.async = true;
            document.head.appendChild(script);

            script.onload = () => {
                window.kakao.maps.load( () => {
                    loadKakaoMap();
                });
            };
        }
    },[]);

        
    
    return(
        <div className="location-container">
            <h2>Map</h2>
            <div ref={mapRef} id="map"  style={ {width: "700px", height: "500px", marginTop: "10px"}}/>
        </div>
    )
}
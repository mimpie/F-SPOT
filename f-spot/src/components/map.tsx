import { useEffect, useState } from "react";

//클린한 위치 좌쵸로 받아오는 코드
//const { kakao } = window;

declare global {
    interface Window {
      kakao: any;
    }
  }
  
  export default function KakaoMap() {
      const [map, setMap] = useState<any>();
      const [marker, setMarker] = useState<any>();
        
      //지도 중심 좌표
      useEffect(() => {
        window.kakao.maps.load(() => {
          const container = document.getElementById("map");
          const options = {
            center: new window.kakao.maps.LatLng(35.133136025767364, 129.10290999238944),
            level: 3,
          };
    
          const mapInstance = new window.kakao.maps.Map(container, options);
          setMap(mapInstance);
    
          const markerInstance = new window.kakao.maps.Marker();
          setMarker(markerInstance);
    
          // 지도에 클릭 이벤트 리스너 추가
          window.kakao.maps.event.addListener(mapInstance, "click", function (mouseEvent: any) {
            // 클릭한 위치 가져오기
            const clickedLatLng = mouseEvent.latLng;
    
            // 마커 위치 설정
            markerInstance.setPosition(clickedLatLng);
    
            // 지도에 마커 표시
            markerInstance.setMap(mapInstance);
    
            // 클릭한 위치를 콘솔에 로그
            //console.log(`클릭한 위치: ${clickedLatLng.getLat()}, ${clickedLatLng.getLng()}`);
          });
        });
      }, []);
    
    
    

    return(<div id="map" style={{ width: "100%", height: "400px" }}></div>)
  }
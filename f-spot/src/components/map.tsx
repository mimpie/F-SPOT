import { useEffect, useState } from "react";
import styled from "styled-components";
//라우터 돔 대신 url변경으로 네비게이팅

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
`;

const WriteButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  border-radius: 50%;
  padding: 10px;
  background-color: #4caf50; /* 버튼 배경색 설정 */
  color: white; /* 버튼 글자색 설정 */
  border: none;
  cursor: pointer;
  z-index: 1; /* 다른 요소 위로 올림 */
`;

const KakaoMap = () => {
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();

  useEffect(() => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          window.kakao.maps.load(() => {
            const container = document.getElementById("map");
            const options = {
              center: new window.kakao.maps.LatLng(latitude, longitude),
              level: 3,
            };

            const mapInstance = new window.kakao.maps.Map(container, options);
            setMap(mapInstance);

            const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);

            // 마커 생성
            const markerInstance = new window.kakao.maps.Marker({
              position: markerPosition,
            });
            setMarker(markerInstance);

            markerInstance.setMap(mapInstance);

            // 추가로 필요한 로직을 여기에 작성하세요.
          });
        },
        (error) => {
          console.error("Error getting current position:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleWriteButtonClick = () => {
    // 글쓰기 버튼 클릭 시 URL 변경
    window.location.href = "/post";
  };

  return (
    <MapContainer>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      <WriteButton onClick={handleWriteButtonClick}>글쓰기</WriteButton>
    </MapContainer>
  );
};

export default KakaoMap;


/*import { useEffect, useState } from "react";
import axios from "axios";

const KakaoMap = () => {
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          window.kakao.maps.load(() => {
            const container = document.getElementById("map");
            const options = {
              center: new window.kakao.maps.LatLng(latitude, longitude),
              level: 3,
            };

            const mapInstance = new window.kakao.maps.Map(container, options);
            setMap(mapInstance);

            const markerInstance = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(latitude, longitude),
            });
            setMarker(markerInstance);

            markerInstance.setMap(mapInstance);

            // 서버에서 마커 정보를 가져와 지도에 표시
            fetchMarkersFromServer(mapInstance);
          });
        },
        (error) => {
          console.error("Error getting current position:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchMarkersFromServer = async (mapInstance) => {
    try {
      const response = await axios.get("/board/markers"); // 적절한 API 엔드포인트를 사용
      setMarkers(response.data);

      // 서버에서 받아온 마커 정보를 사용하여 지도에 마커를 추가
      response.data.forEach((markerInfo) => {
        const markerPosition = new window.kakao.maps.LatLng(
          markerInfo.latitude,
          markerInfo.longitude
        );
        const markerInstance = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        markerInstance.setMap(mapInstance);
      });
    } catch (error) {
      console.error("마커 정보를 가져오는 데 실패했습니다.", error);
    }
  };

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default KakaoMap;
*/
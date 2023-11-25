import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const MapContainer = styled.div`
  width: calc(100% - 40px); /* 가로 20px 패딩을 양쪽에 적용 */
  height: calc(100vh - 40px); /* 세로 20px 패딩을 위아래로 적용 */
  padding: 20px; /* 내부에 있는 요소들에 적용할 패딩 */
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
  const [currentLocationMarker, setCurrentLocationMarker] = useState<any>();
  const [markers, setMarkers] = useState<any[]>([]);

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

            // Create a marker for the current location
            const currentLocationMarkerPosition = new window.kakao.maps.LatLng(latitude, longitude);
            const currentLocationMarkerInstance = new window.kakao.maps.Marker({
              position: currentLocationMarkerPosition,
              image: new window.kakao.maps.MarkerImage(
                "my_location.png",  // replace with your marker image URL
                new window.kakao.maps.Size(30, 30),
                { offset: new window.kakao.maps.Point(15, 30) }
              ),
            });
            setCurrentLocationMarker(currentLocationMarkerInstance);

            // Fetch marker data from the server using Axios
            axios.get("http://ec2-13-124-152-41.ap-northeast-2.compute.amazonaws.com/board/list")
              .then((response) => {
                const data = response.data.result;
                //console.log(data);
                setMarkers(data);

                // Create markers based on the received data
                createMarkers(mapInstance, data);

                // Set the current location marker on the map
                currentLocationMarkerInstance.setMap(mapInstance);
              })
              .catch((error) => {
                console.error("Error fetching marker data:", error);
              });
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

  const createInfowindow = (mapInstance: any, boardInfo: any) => {
    const { nickname, likeCnt, createdAt, content } = boardInfo;
  
    // createdAt을 JavaScript Date 객체로 변환
    const createdDate = new Date(createdAt);
  
    // 날짜를 원하는 형식으로 변환 (YYYY-MM-DD)
    const formattedDate = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}-${String(createdDate.getDate()).padStart(2, '0')}`;
  
    const infowindowContent = `
      <div style="width: 200px; padding: 10px; background-color: #fff; border: 1px solid #ccc; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1); text-align: left;">
        <p style="font-size: 14px; margin-bottom: 10px;">작성자: ${nickname}</p>
        <h3 style="font-size: 16px;">${content}</h3>
        <p style="font-size: 14px; margin-bottom: 5px;">좋아요: ${likeCnt}</p>
        <p style="font-size: 14px; margin-bottom: 5px;">작성일: ${formattedDate}</p>
      </div>
    `;
  
    const infowindow = new window.kakao.maps.InfoWindow({
      content: infowindowContent,
    });
  
    return infowindow;
  };
  
  
  const createMarkers = (mapInstance: any, data: any[]) => {
    data.forEach((markerInfo) => {
      const { latitude, longitude, tags, colors, boardImageUrl, boardId } = markerInfo;
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
  
      const markerInstance = new window.kakao.maps.Marker({
        position: markerPosition,
        image: new window.kakao.maps.MarkerImage(
          boardImageUrl[0],
          new window.kakao.maps.Size(30, 30),
          { offset: new window.kakao.maps.Point(15, 30) }
        ),
      });
  
      // Set marker color based on the 'tags' property
      if (tags && tags.length > 0) {
        const tag = tags[0]; // Assuming only one tag is used for simplicity
        let markerColor = "#ffffff"; // Default color
  
        // Set marker color based on the 'colors' property
        const colorToFileName: Record<string, string> = {
          "#ffb3ba": "red.png",
          "#ffdfba": "orange.png",
          "#baffc9": "green.png",
          "#bae1ff": "blue.png",
        };
  
        if (colors) {
          switch (tag) {
            case "Accident":
              markerColor = "#ffb3ba";
              break;
            case "GoodRestaurant":
              markerColor = "#ffdfba";
              break;
            case "Tour":
              markerColor = "#baffc9";
              break;
            case "SNS":
              markerColor = "#bae1ff";
              break;
            default:
              break;
          }
        }
  
        const markerImageSrc = colorToFileName[markerColor as keyof typeof colorToFileName];
        markerInstance.setImage(new window.kakao.maps.MarkerImage(
          markerImageSrc,
          new window.kakao.maps.Size(30, 30),
          { offset: new window.kakao.maps.Point(15, 30) }
        ));
  
        // Create an infowindow for each marker
        const infowindow = createInfowindow(mapInstance, markerInfo);
  
        // Add click event listener to each marker
        window.kakao.maps.event.addListener(markerInstance, 'click', () => {
          // Open the infowindow when a marker is clicked
          infowindow.open(mapInstance, markerInstance);
        });
      }
  
      markerInstance.setMap(mapInstance);
    });
  };
  

  const fetchBoardInformation = (boardId: any) => {
    // Replace 'your-jwt-token' with the actual JWT token
    const jwtToken = 'eyJ0eXBlIjoiand0IiwiYWxnIjoiSFMyNTYifQ.eyJpZCI6MiwiaWF0IjoxNzAwODM1NzkxLCJleHAiOjE3MDIzMDcwMjB9.K2e6qXrcbQh-x9RrWgGLC_n403IfxgIEphWNor2fsdI';

    // Make a GET request to fetch board information
    axios.get(`http://ec2-13-124-152-41.ap-northeast-2.compute.amazonaws.com/board/${boardId}`, {
      headers: {
        'X-ACCESS-TOKEN': jwtToken,
      },
    })
      .then((response) => {
        const boardData = response.data;
        console.log('Board Information:', boardData);
      })
      .catch((error) => {
        console.error('Error fetching board information:', error);
      });
  };

  const handleWriteButtonClick = () => {
    // 글쓰기 버튼 클릭 시 URL 변경
    window.location.href = "/post";
  };

  return (
    <MapContainer>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      <WriteButton onClick={handleWriteButtonClick}>쓰기</WriteButton>
    </MapContainer>
  );
};

export default KakaoMap;




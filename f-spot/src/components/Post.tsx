import axios from "axios";
import { useEffect, useState } from "react";
import { styled } from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid #1d9bf0;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: black;
  background-color: white;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
  margin: 10px; /* Adjust the margin as needed */
`;


const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const TagSelection = styled.div`
  display: flex;
  gap: 10px;
`;

const TagCheckbox = styled.input`
  margin-right: 5px;
`;

const KakaoMapContainer = styled.div`
  width: 100%;
  height: 400px;
`;

export default function PostForm() {
    const [feed, setfeed] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setfeed(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const token = 'eyJ0eXBlIjoiand0IiwiYWxnIjoiSFMyNTYifQ.eyJpZCI6MiwiaWF0IjoxNzAwODM1NzkxLCJleHAiOjE3MDIzMDcwMjB9.K2e6qXrcbQh-x9RrWgGLC_n403IfxgIEphWNor2fsdI';
  
    // Create a new FormData object
    const formData = new FormData();
  
    formData.append('content', feed);

  // Use the non-null assertion operator (!) to assert that file is not null
  formData.append('images', file!);

  // Check if selectedTag exists before appending
  if (selectedTag !== null) {
    formData.append('tags', selectedTag);
  }
  formData.append('latitude', marker.getPosition().getLat().toString());
  formData.append('longitude', marker.getPosition().getLng().toString());
    console.log("Form data:", formData);
  
    try {
      const response = await axios.post(
        `http://ec2-13-124-152-41.ap-northeast-2.compute.amazonaws.com/board/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-ACCESS-TOKEN': token,
          },
        }
      );
  
      console.log("Server response:", response.data);
      window.location.href = '/'; 
      // Handle success or other logic here
    } catch (error) {
      console.error("Error sending data to the server:", error);
  
      // Handle error or other logic here
    }
  };
  
  
  
  

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
        console.log(`클릭한 위치: ${clickedLatLng.getLat()}, ${clickedLatLng.getLng()}`);
      });
    });
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={feed}
        placeholder="What is happening?!"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added ✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
      <TagSelection>
        <TagCheckbox
          type="checkbox"
          id="tour"
          checked={selectedTag === "Tour"}
          onChange={() => handleTagChange("Tour")}
        />
        <label htmlFor="tour">Tour</label>

        <TagCheckbox
          type="checkbox"
          id="goodRestaurant"
          checked={selectedTag === "GoodRestaurant"}
          onChange={() => handleTagChange("GoodRestaurant")}
        />
        <label htmlFor="goodRestaurant">GoodRestaurant</label>

        <TagCheckbox
          type="checkbox"
          id="accident"
          checked={selectedTag === "Accident"}
          onChange={() => handleTagChange("Accident")}
        />
        <label htmlFor="accident">Accident</label>

        <TagCheckbox
          type="checkbox"
          id="sns"
          checked={selectedTag === "SNS"}
          onChange={() => handleTagChange("SNS")}
        />
        <label htmlFor="sns">SNS</label>
      </TagSelection>
      <KakaoMapContainer id="map" />
      <SubmitBtn type="submit" value="Post feed" />
    </Form>
  );
}

import './App.css';
import './FullScreen.css';
import React from 'react';
import CamHandler from './CamHandler';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom'; // ReactDOM import 추가


function ImageWindow({ imageUrl }) {
  const imageRef = useRef(null);

  useEffect(() => {
    // imageUrl이 변경되면 이미지 업데이트
    if (imageUrl) {
      imageRef.current.src = imageUrl;
    }
  }, [imageUrl]);

  const fullscreenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const imageStyle = {
    objectFit: 'cover',
    maxWidth: '100%',
    maxHeight: '100%',
  };

  return (
    <div style={fullscreenStyle}>
      <img ref={imageRef} alt="Image" style={imageStyle}/>
    </div>
  );
}
function App() {
  const [webcamRef, setRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [receivedImage, setRecievedImage] = useState(null);
  const [presetValue, setPresetValue] = useState('');
  const [websocket, setWebsocket] = useState(null);
  const numberOptions = ['1', '2', '3', '4', '5'];

  const option = {}
  
  
  const changePresetValue = (e) =>{
    const number = e.target.value;
    setPresetValue(number);
  }

  const [imageWindow, setImageWindow] = useState(null);

  // display image on new screen
  const openImageWindow = () => {
    setImageWindow(window.open('', '_blank'));
  };

  const closeImageWindow = () => {
    if (imageWindow) {
      imageWindow.close();
      setImageWindow(null);
    }
  };

  useEffect(() => {
    // 컴포넌트가 언마운트되면 이미지 창을 닫음
    return () => {
      closeImageWindow();
    };
  }, []);


  //transmission



  const captureDetector = useEffect(() => {
    if(capturedImage){
      if (imageWindow) {
        imageWindow.document.body.innerHTML = `<div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;"><img src="${receivedImage}" alt="Image" style="object-fit: cover; width: 100%; height: 100%;" /></div>`;
      } else {
        openImageWindow();
      }      
      sendImageToServer(capturedImage, presetValue);
    }
  }, [capturedImage]);
  
  const sendImageToServer = (capturedImage, presetValue) => {
    const imageSet = new FormData();  
    imageSet.append('image', capturedImage);
    imageSet.append('preset', presetValue);
    axios.post("url", imageSet, {
      responseType: 'arraybuffer'
    })
    .then((response)=>{
      const imageArrayBuffer = response.data;
      const imageBlob = new Blob([imageArrayBuffer], {type: 'image/jpeg'});
      const imageUrl = URL.createObjectURL(imageBlob);
      setRecievedImage(imageUrl);
      
    })
    .catch((error) => {
      console.error(error);
    })
  };

  return (
     
    <div className="App">
      <CamHandler setRef = {setRef} capturedImage = {capturedImage} setCapturedImage = {setCapturedImage}/>
      <h2>CAPTURED IMAGE</h2>
      <img src = {capturedImage} />
      <h2>recievedImage</h2>
      <div>
        <select value = {presetValue} onChange={changePresetValue}>
          {numberOptions.map((number) => (
            <option key= {number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>
      <img src = {receivedImage} />
    </div>
    /**
    <div className='fullscreen-image'>
      <img src={testImage}/>    
      </div>
    */
  );
}

export default App;


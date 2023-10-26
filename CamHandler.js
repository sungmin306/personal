import React from 'react'
;import Webcam from 'react-webcam';
import {useRef, useEffect, useState} from 'react';
function CamHandler(props){
  const videoConstraints = {
      width: {max:1080},
      height:{max:720},
      facingMode: "user"
    }
    const webcamRef = useRef();
    let videoSrc = null;

  const getVideoSrc = () => {
      props.setRef(webcamRef.current);
      console.log(webcamRef)
    };
    const stopCam = React.useCallback(()=>{
      videoSrc = webcamRef.current.video;
      videoSrc.pause();
    });
    const startCam = React.useCallback(()=>{
      videoSrc = webcamRef.current.video;
      videoSrc.play();
    });

  const [isCapturing, setIsCapturing] = useState(true);

  const toggler = useEffect(() => {
    let captureInterval;

    if (isCapturing) {
      captureInterval = setInterval(() => {
        capture();
      }, 5000);
    }

    return () => {
      clearInterval(captureInterval);
    };
  }, [isCapturing]);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    props.setCapturedImage(imageSrc);
    console.log(imageSrc)
  };

  const clearCapture = () => {
    props.setCapturedImage(null);
  };

  const toggleCapture = () => {
    setIsCapturing(!isCapturing);
  };


    return (
      <div className="camSection" >
        <Webcam style={{position:'absolute', top: '-9999px', left:'-9999px'}}muted={false} screenshotFormat='image/png' ref={webcamRef} onCanPlay={getVideoSrc} />
      <div>

      <button onClick={capture}>Capture Image</button>
      <button onClick={clearCapture}>Clear Image</button>
      <button onClick={toggleCapture}>
          {isCapturing ? 'Pause Capture' : 'Resume Capture'}
          {isCapturing ? 'Pause Capture' : 'Resume Capture'}
      </button>
      </div>
      </div>
    );
}
export default CamHandler;

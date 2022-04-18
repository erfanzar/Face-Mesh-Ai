import './App.css';
import React , {useEffect, useRef, useState} from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as Model from '@tensorflow-models/face-landmarks-detection';
import { drawMesh } from './utilities';



const App = ()=>{

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [load , setLoad] = useState(null);
  var  net = null
 
  const runModel = async () => {
  
    net = await Model.load(Model.SupportedPackages.mediapipeFacemesh,{maxFaces:1});
    if(net != null ){
      setLoad(1)
    }
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
     
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const pred = await net.estimateFaces({input:video});
      
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(()=>{drawMesh(pred, ctx)});
    }
  };

  useEffect(()=>{runModel()}, []);

  const ww = window.innerWidth
  const wh = window.innerHeight
  console.log(`width set to : ${ww}`)
  console.log(`height set to : ${wh}`)

  if(load != null){
    return (
      <div className="App">
        <header className="App-header">
          <Webcam
            ref={webcamRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: {ww},
              height: {wh},
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: {ww},
              height: {wh},
            }}
          />
        </header>
      </div>
    );
  }else{
    return(
      <div className='loading'>
        <p>Loading Model From Server...</p>
      </div>
    )
  }
}

export default App;

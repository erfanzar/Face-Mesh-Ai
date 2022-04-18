import './App.css';
import React , {useEffect, useRef, useState} from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as FcModel from '@tensorflow-models/face-landmarks-detection';

const drawer = (prediction,ctx)=>{

  if (prediction.length > 0){
    // console.log('started');
    prediction.forEach(pred=>{
        const points = pred.scaledMesh;
        for(let i=0; i < points.length;i++){
          
          const x = points[i][0];
          const y = points[i][1];
          // console.log(x,y);
          
          console.log(ctx);
          ctx.beginPath();
          ctx.arc(x, y, 50, 0, 3 * Math.PI);
          ctx.fill();
          console.log(ctx);
      }
    })
  }
}


const App = ()=>{
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runModel = async () =>{

    const net  = await FcModel.load(
      FcModel.SupportedPackages.mediapipeFacemesh
    );
    console.log('Model Loaded SuccessFully');
    setInterval(() => {
      detection(net)
    }, 60);
    
  };

  const detection = async(net)=>{
    if (
      webcamRef.current !== null&&
      typeof webcamRef.current != "undefined"&&
      webcamRef.current.video.readyState === 4
    ){


      const video = webcamRef.current.video;
      const videoHeight = webcamRef.current.videoHeight;
      const videoWidth  = webcamRef.current.videoWidth;

      webcamRef.current.video.height = videoHeight;
      webcamRef.current.video.width  = videoWidth;

      canvasRef.current.width  = videoWidth;
      canvasRef.current.height = videoHeight;

      const Prediction = await net.estimateFaces({input:video});


    
      const ctx = canvasRef.current.getContext("2d");

      // console.log(ctx);
      requestAnimationFrame(()=>{drawer(Prediction,ctx)})
        
    }
  }

  useEffect(()=>{runModel()},[])

  return(
    <div>
      <header>
      <Webcam
        ref={webcamRef}
        height={480}
        width={640}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 640,
          height: 480,
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
        width: 640,
        height: 480,
      }}
      />
      </header>
    </div>
  )
}

export default App;

import logo from './logo.svg';
import './App.css';
import React , {useEffect, useRef, useState} from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as model from '@tensorflow-models/face-landmarks-detection';

const App = ()=>{

  const webcamref = useRef(null);

  // console.log(webcamref);

  const RunModel = async()=>{

    const net = await model.load(
      model.SupportedPackages.mediapipeFacemesh
    );
    console.log("model Loaded");

    setInterval(()=>{
      detect(net)
    } , 60)
  }
  const detect = async (net)=>{
    if (
      typeof webcamref.current !== "undefined" &&
      webcamref.current != null &&
      webcamref.current.video.readyState === 4
    ){
      const video  = webcamref.current.video;
      const height = webcamref.current.video.videoHeight;
      const width  = webcamref.current.video.videoWidth;

      const pred = await net.estimateFaces({input : video})

      console.log(pred)
    }
  }
  useEffect(
    ()=>{
      RunModel();
    },[]
  )
  return(
    <div>
      <Webcam className='Camera'
        ref={webcamref}
        height={480}
        width={640}       
      />
    </div>
  );
}

export default App;

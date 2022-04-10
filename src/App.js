import logo from './logo.svg';
import './App.css';
import React , {useEffect, useRef, useState} from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as model from '@tensorflow-models/pose-detection'
import glass from './png_glasses_31208.png';
const App = ()=>{

  const webcamref = useRef(null);

  // console.log(webcamref);
  const wh = window.innerHeight;
  const ww = window.innerWidth;

  const [x , setx] = useState(null);
  const [y , sety] = useState(null);
  const [neto, setNet] = useState(null);
  const RunModel = async()=>{

    const mdl = model.SupportedModels.MoveNet;
    const net = await model.createDetector(mdl);

    console.log("model Loaded");
    if (net != null){
      setNet(1)
    }
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

      const pred = await net.estimatePoses(video)
      

      const www = ww/width
      const wwh = wh/height
      // console.log(pred)

      if(pred.length > 0){
        for (let o of pred){
          console.log(o.keypoints)
          const landmark = o.keypoints
          setx(landmark[0].x*wwh)
          sety(landmark[2].y*www)
        }
        
      }
    }
  }
  useEffect(
    ()=>{
      RunModel();
    },[]
  )
  if (neto == null){
    return(
      <div className='loading'>
        <p>
          Loading ...
        </p>
      </div>
    )
  }
  else{
    return(
      <div className='app'>
        <div className='cont'>
        <Webcam className='Camera'
          ref={webcamref}
          height={480}
          width={640}       
        />
        
          <div className='point' style={{left:`${x-wh/9.5}px` , top:`${y-ww/7}px`} }>
            <img src={glass} style={{
              height:wh/7,
              width:ww/3,
            }}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

import './App.css';
import React , {useEffect, useRef, useState} from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs'
import * as model from '@tensorflow-models/pose-detection'
import * as FcModel from '@tensorflow-models/face-landmarks-detection'
import glass from './png_glasses_31208.png';
const App = ()=>{


  /// Start Defining Values

  const webcamref = useRef(null);

  const wh = window.innerHeight;
  const ww = window.innerWidth;

  var ttw = 0;

  const [th , setth] = useState(null);
  const [tw , settw] = useState(null);

  const [x , setx] = useState(null);
  const [y , sety] = useState(null);

  const [past,setpast] = useState(null);
  const [next,setnext] = useState(null);

  const [neto, setNet] = useState(null);

  /// End Defining Values

  /// Start Function Run Model

  const RunModel = async()=>{
  
    
    const net = await FcModel.load(FcModel.SupportedPackages.mediapipeFacemesh,{maxFaces:1})
    // const mdl = model.SupportedModels.MoveNet;
    // const net = await model.createDetector(mdl);
   
    console.log("model Loaded");
    if (net != null){
      setNet(1)
    }
    setInterval(()=>{
      detect(net)
    } , 60)
  }


  /// End Function Run Model

  /// Start Fucntion Detect

  const detect = async (net)=>{
    if (
      typeof webcamref.current !== "undefined" &&
      webcamref.current != null &&
      webcamref.current.video.readyState === 4
    ){
      const video  = webcamref.current.video;
      const height = webcamref.current.video.videoHeight;
      const width  = webcamref.current.video.videoWidth;
      
      const www = ww/640
      const wwh = wh/480
      // const pred = await net.estimatePoses(video)
      const pred = await net.estimateFaces({input:video})


      // console.log(pred)

      if(pred.length > 0){
        for (let o of pred){
          console.log(o.annotations)


          // console.log(o.annotations.leftEyeIris[0][1],o.annotations.leftEyeIris[0][0])
          // console.log(o.annotations.rightEyeIris[0][1],o.annotations.rightEyeIris[0][0])

          const landmark = o.annotations

          const tth = (landmark.leftEyeLower2[2][1]-landmark.leftEyebrowUpper[4][1])*wwh*1.2
          

          if (landmark.leftEyeLower0[0][0]>landmark.rightEyeLower0[0][0]){
            ttw = (landmark.leftEyeLower0[0][0]-landmark.rightEyeLower0[0][0])*www*1.5
          }else if (landmark.leftEyeLower0[0][0]<landmark.rightEyeLower0[0][0]){
            ttw = (landmark.rightEyeLower0[0][0]-landmark.leftEyeLower0[0][0])*www*1.5
          }

          setx(landmark.leftEyebrowLower[0][0]*www)
          sety(landmark.leftEyebrowLower[0][1]*wwh)
          setth(tth)
          settw(ttw)
        }
      }else{
        setx(null);
        sety(null);
        // console.log('Null Set')
      }

      // if(pred.length > 0){
      //   for (let o of pred){
      //     console.log(o.keypoints)
      //     const landmark = o.keypoints
      //     setx(landmark[0].x*www)
      //     sety(landmark[2].y*wwh)
      //   }
        
      // }else{
      //   setx(null);
      //   sety(null);
      //   console.log('Null Set')
      // }
    }
  }

  /// End Fucntion Detect

  /// Start UseEffect
  useEffect(
    ()=>{
      RunModel();
    },[]
  )
/// End UseEffect

/// Start Effect USer Function


  const Effect = () => {
    if (setx && sety != null){
      console.log(th,tw)
      return(
        <div className='point' style={{left:`${x}px` , top:`${y}px`} }>
          <img src={glass} style={ x&&y != null ?{            
            height:Math.abs(th),
            width:tw,
          } : {
            height:0,
            width:0,
          }}/>
        </div>
      )
    }else{
      return(
        <div></div>
      )
    }
  }


  /// End Effect USer Function

  /// Final Return From App Function


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
        { 
          Effect()
        }
        </div>
      </div>
    );
  }
}

export default App;

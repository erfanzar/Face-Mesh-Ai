import './App.css';
import React , {useEffect, useRef, useState} from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as Model from '@tensorflow-models/face-landmarks-detection';
import { drawMesh } from './utilities';
// import img from 'public/assets/Glass.png'



const App = ()=>{

  const webcamRef = useRef(null);
  const divRef = useRef(null);
  const canvasRef = useRef(null);


  const [gh,setgh] = useState(null);
  const [gw,setgw] = useState(null);

  const [xle,setxle] = useState(null);
  const [yle,setyle] = useState(null);
  
  const [xre,setxre] = useState(null);
  const [yre,setyre] = useState(null);

  const [xel,setxel] = useState(null);
  const [yel,setyel] = useState(null);

  const [xer,setxer] = useState(null);
  const [yer,setyer] = useState(null);

  const [xnose,setxnose] = useState(null);
  const [ynose,setynose] = useState(null);

  const [lmlist,setlmlist] = useState(null);


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

  const ww = window.innerWidth
  const wh = window.innerHeight

  
  const le = 71
  const re = 300
  const el = 127
  const er = 356
  const nose = 4
  


  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
     
      const video = webcamRef.current.video;
      const videoWidth  = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      
      webcamRef.current.video.width  = videoWidth;
      webcamRef.current.video.height = videoHeight;

      
      divRef.current.width  = videoWidth;
      divRef.current.height = videoHeight;

      canvasRef.current.width  = videoWidth;
      canvasRef.current.height = videoHeight;


      const pred = await net.estimateFaces({input:video});

      
      // console.log(ctx);
      
      if (pred.length > 0){
        var ctx = canvasRef.current.getContext("2d");
        pred.forEach(prediction => {

          var lm = prediction.scaledMesh;

          setxle(Math.abs(lm[le][0]-videoWidth));   //DONE
          setyle(Math.abs(lm[le][1]  ));            //DONE
        
          setxre(Math.abs(lm[re][0]-videoWidth)); //DONE
          setyre(Math.abs(lm[re][1]  ));          //DONE

          setxel(Math.abs(lm[el][0]-videoWidth));  //DONE
          setyel(Math.abs(lm[el][1]  ));           //DONE

          setxer(Math.abs(lm[er][0]-videoWidth)); //DONE
          setyer(Math.abs(lm[er][1]  ));          //DONE

          setxnose(Math.abs(lm[nose][0]-videoWidth)); //DONE
          setynose(Math.abs(lm[nose][1]  ));          //DONE
          setlmlist([[xle,yle],[xre,yre],[xel,yel],[xer,yer],[xnose,ynose]]);//DONE

          ctx.beginPath();
          ctx.arc(xle,yle,5,0,3*Math.PI)
          ctx.fillStyle = 'aqua'
          ctx.fill()
          setgh(xre-xle+xle)
          // console.log(
            // xre-xle+xle,` xre :${xre} xle :${xle}`
          // );
        });
      }
    }
  };

  useEffect(()=>{
    runModel()
    console.log(`width set to : ${ww}`)
    console.log(`height set to : ${wh}`)
  
  }, []);

  // console.log(`gh set to : ${gh}`)

  // console.log(divRef);
  
  if(load != null){
    return (
      <div className="App">
        <header className="App-header">
          <Webcam
            ref={webcamRef}
            mirrored={true}
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
          >
          </canvas>
          <div
            ref={divRef}
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
          > 
            {
              xel != null ?
              <img src='/assets/Glass.png' style={{
                left:`${xle}px`,
                top:`${yre}px`,
                zIndex:15,
                height:`${70}px`,
                width:'150px',
                position:'absolute',

              }}></img> :<div/>
            }

          </div>
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

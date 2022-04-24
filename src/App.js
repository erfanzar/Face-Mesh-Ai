import './App.css';
import React , {useEffect, useRef, useState} from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as Model from '@tensorflow-models/face-landmarks-detection';
import { drawMesh } from './utilities';
// import glass from '/assets/Glass.png';
// import img from 'public/assets/Glass.png'

// xle for the position of X Left Eye
// yle for the position of Y Left Eye

// xre for the position of X Right Eye
// yre for the position of Y Right Eye

// xer for the position of X Right Ear
// yer for the position of Y Right Ear

// xel for the position of X Left Ear
// yel for the position of Y Left Ear

const App = ()=>{

  var resemicalDistance = 2

  const webcamRef = useRef(null);
  const divRef = useRef(null);
  const canvasRef = useRef(null);

  const [translate,setTranslate] = useState(0);

  const [transformds,setTransform] = useState(null);
  const [showCornerLeft ,setshowCornerLeft  ] = useState(null)
  const [showCornerRight,setshowCornerRight ] = useState(null)
  const [gh,setgh] = useState(null);
  const [gw,setgw] = useState(null);

  const [to,setto] = useState(null);
  const [tt,settt] = useState(null);

  const [xlp,setxlp] = useState(null);
  const [ylp,setylp] = useState(null);

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

  var txle = 0;
  var tyle = 0;
  var txre = 0;
  var tyre = 0;
  
  var txer = 0;
  var tyer = 0;
  var txel = 0;
  var tyel = 0;
  

  const [load , setLoad] = useState(null);
  var  net = null;

  const runModel = async () => {
  
    net = await Model.load(Model.SupportedPackages.mediapipeFacemesh,{maxFaces:1});
    if(net != null ){
      setLoad(1);
    }
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const ww = 640;
  const wh = 480;

  const le = 71;
  const re = 300;
  const el = 162;
  const er = 389;
  const nose = 4;
  
  let trapa = null;



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

          setxle(Math.abs(lm[le][0]));   //DONE
          setyle(Math.abs(lm[le][1]));            //DONE
        
          setxre(Math.abs(lm[re][0])); //DONE
          setyre(Math.abs(lm[re][1]));            //DONE

          setxel(Math.abs(lm[el][0]));  //DONE
          setyel(Math.abs(lm[el][1]));            //DONE

          setxer(Math.abs(lm[er][0])); //DONE
          setyer(Math.abs(lm[er][1]));            //DONE

          setxnose(Math.abs(lm[nose][0])); //DONE
          setynose(Math.abs(lm[nose][1]));          //DONE
          setlmlist([[xle,yle],[xre,yre],[xel,yel],[xer,yer],[xnose,ynose]]);//DONE
          
          setTransform((yle-yre / 2)); //DONE
          trapa = transformds;
          ctx.beginPath();
          ctx.arc(xle,yle,5,0,3*Math.PI)
          ctx.fillStyle = 'aqua'
          ctx.fill()
          // console.log((Math.abs(lm[le][1])-Math.abs(lm[re][1]))/2);
          setgh(xre-xle+xle)
          // console.log(
            // xre-xle+xle,` xre :${xre} xle :${xle}`
          // );

          txel = Math.abs(lm[el][0])
          tyel = Math.abs(lm[el][1])

          txle = Math.abs(lm[le][0])
          tyle = Math.abs(lm[le][1])

          txer = Math.abs(lm[er][0])
          tyer = Math.abs(lm[er][1])

          txre = Math.abs(lm[re][0])
          tyre = Math.abs(lm[re][1])

          const  wcpLeft  = txel - txle
          const  wcpRight = txre - txer
          
          // console.log(`wcpRight: ${wcpRight}`)
          // console.log(txel,txle,txre,txer);
          // console.log(`wcpLeft: ${wcpLeft}`)
          // console.log('left eye',xle);
          // console.log('ear left',xel);
          // console.log(`xeye:${txle},xear:${txel},di:${wcpLeft}`);
          if ( wcpLeft > resemicalDistance )
          {
            setshowCornerLeft(true)
          }else if (wcpLeft < resemicalDistance  || xle == null || xel == null){
            setshowCornerLeft(false)
            console.log('Left set to nul !!!!!!!!!!!!!!')
          }
          if ( wcpRight > resemicalDistance)
          {
            setshowCornerRight(true)
          }else if ( wcpRight < resemicalDistance || xre == null || xer == null){
            setshowCornerRight(false)
            console.log('Right set to nul !!!!!!!!!!!!!!')

          }

        });
      }else{
        setxle(null);   //DONE
        setyle(null);            //DONE
      
        setxre(null); //DONE
        setyre(null);            //DONE

        setxel(null);  //DONE
        setyel(null);            //DONE

        setxer(null);
                //DONE
        setyer(null);            
                //DONE

        setxnose(null); 
                //DONE
        setynose(null);
                //DONE
        setlmlist(null);
                //DONE
        setshowCornerRight(null)
        setshowCornerLeft(null)

      }
    }
  };

  useEffect(()=>{
    runModel()
    console.log(`width set to : ${ww}`)
    console.log(`height set to : ${wh}`)
    
    // for(let b=0;b<100;b++){
    //   setTimeout(()=>{
    //   setTranslate(b)},900)
    // }
  }, []);
  if (
     showCornerLeft != null
  ){
    // console.log(`corner Right set to : ${showCornerRight}`)
    // console.log(`corner Left  set to : ${showCornerLeft}`)
  }
  // console.log(`postion of x set to : ${xel}`)
  // console.log(`postion of y set to : ${yel}`)
  // console.log(trapa);
  // if (transform != null){
  //   if (trapa < 3){
  //     settt(true);
  //   }else{
  //     settt(false);
  //   };
  //   if (trapa > -9){
  //     setto(true);
  //   }else{
  //     setto(false);
  //   };
  // };


  // console.log(`corner Right set to : ${showCornerRight}`)
  // console.log(`corner Left  set to : ${showCornerLeft}`)


  var lefteyex = xle
  var leftearx = xel

  var lefteyey = yle
  var lefteary = yel
  
  // console.log(leftearx-lefteyex);

  var rightearx = xer
  var righteyex = xre
  
  var righteary = yer
  var righteyey = yre

  // console.log(righteyex-rightearx);


  if(load != null){
  // if(1>2){
    return (
      <div className="App">
        <header className="App-header">
          <Webcam
            ref={webcamRef}

            mirrored={true}
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
              width: `${640}px`,
              height: `${480}px`,
  
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
            width: `${640}px`,
            height: `${480}px`,

          }}

          />
          
          
          <div
            
            ref={divRef}
            
            style={{
              
              position: "relative",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: `${640}px`,
              height: `${480}px`,

            }}
          > 
            {
              xle != null ?
              <img src='/assets/Glass.png' style={xle !== null  ?{
                right:`${xle}px`,
                top:`${yre}px`,
                zIndex:15,
                height:`${(xre-xle)/3}px`,
                width:`${xre-xle}px`,
                position:'absolute',
                transform:`rotate(${transformds}deg)`
              } : {
                left:`${0}px`,
                top:`${0}px`,
                zIndex:15,
                height:`${0}px`,
                width:`${0}px`,
                position:'absolute',
              }}></img> :<div/>
            }

            {
              xel != null && showCornerLeft !== null && leftearx-lefteyex>5 ? 
              <img
              src='/assets/Corner.png'
              style={showCornerLeft !== null ?{
              position: "absolute",
              top: `${(yel)}px`,
              right: `${(xer-(xer/6.5) )}px`,
              zindex: 16,
              width:  `${Math.abs(leftearx-righteyex)}px`,
              height: `${Math.abs(lefteary-lefteyey)*8}px`,
              transform:`skewx(${15}deg)`
              // width:200,
              // height:80,
              }:{
                position: "absolute",
                top: `${0}px`,
                right: `${0}px`,
                zindex: 9,
                width: `${0}px`,
                height: `${0}px`,
              }}
              />:<div></div>
            }
             {
              xer != null && showCornerRight !== null && rightearx-righteyex>5 ? 
              <img
              src='/assets/Corner.png'
              style={showCornerRight !== null ?{
              position: "absolute",
              top: `${(yer)}px`,
              right: `${(xer-(xel/6.5))}px`,
              zindex: 16,
              width:  `${Math.abs(rightearx-righteyex)*6}px`,
              height: `${Math.abs(righteary-righteyey)*8}px`,
              // width:200,
              // height:80,
              transform:'rotate(180deg)'
              }:{
                position: "absolute",
                top: `${0}px`,
                right: `${0}px`,
                zindex: 9,
                width: `${0}px`,
                height: `${0}px`,
              }}
              />:<div></div>
            }
           
          </div>
        </header>
      </div>
    );
  }else{
    return(
      <div className='loading'>
        <p style={{
          // transform:`translatey(${translate}px)`
        }}>
          Loading Model From Server...
          Please Be Paitent   
        </p>
        
      </div>
    )
  }
}

export default App;

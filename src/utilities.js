export const drawMesh = (predictions, ctx,vh,vw) => {

    if (predictions.length > 0) {

      predictions.forEach((prediction) => {

        const lm = prediction.scaledMesh;
        const le = 71
        const re = 300
        const el = 127
        const er = 356
        const nose = 4

        const xle = Math.abs(lm[le][0]-vw); //DONE
        const yle = Math.abs(lm[le][1]  );  //DONE
        
        const xre = Math.abs(lm[re][0]-vw);
        const yre = Math.abs(lm[re][1]  );

        const xel = Math.abs(lm[el][0]-vw);
        const yel = Math.abs(lm[el][1]  );

        const xer = Math.abs(lm[er][0]-vw);
        const yer = Math.abs(lm[er][1]  );

        const xnose = Math.abs(lm[nose][0]-vw);
        const ynose = Math.abs(lm[nose][1]  );

        const lmlist = [[xle,yle],[xre,yre],[xel,yel],[xer,yer],[xnose,ynose]]
        
        console.log(lm.length)
        
        // lmlist.forEach(j=>{
        //   ctx.beginPath();
        //   const x = j[0]
        //   const y = j[1]
        //   ctx.arc(x,y,2,0,3*Math.PI)
          // ctx.closePath();
        // })
        ctx.arc(xle,yle,2,0,3*Math.PI)
        ctx.arc(xre,yre,2,0,3*Math.PI)
        // ctx.arc(xel,yel,2,0,3*Math.PI)
        // ctx.arc(xer,yer,2,0,3*Math.PI)
        // ctx.arc(xnose,ynose,2,0,3*Math.PI)


        for (let i = 0; i < lm.length; i++) {

          if(0<i<100){
            ctx.fillStyle='aqua';
            if (100<i<200){
              ctx.fillStyle='green';
              if (200<i<300){
                ctx.fillStyle='green';
                if (300<i<400){
                  ctx.fillStyle='black';
                  if (400<i<500){
                    ctx.fillStyle='red';
                  }        
                }
              }
            }  
          }
          
          ctx.fill();
        }
      })

    }
  };
  
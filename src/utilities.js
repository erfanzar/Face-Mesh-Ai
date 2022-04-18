export const drawMesh = (predictions, ctx,vh,vw) => {

    if (predictions.length > 0) {

      predictions.forEach((prediction) => {

        const keypoints = prediction.scaledMesh;

        for (let i = 0; i < keypoints.length; i++) {

          const x = Math.abs(keypoints[i][0]-vw);
          const y = Math.abs(keypoints[i][1]  );
          console.log(keypoints.length)
          ctx.beginPath();
          ctx.arc(x,y,2,0,3*Math.PI)
          if(0<i<100){
            ctx.fillStyle='aqua';
          }
          if (100<i<200){
              ctx.fillStyle='green';
          }
          if (200<i<300){
            ctx.fillStyle='green';
          }
          if (300<i<400){
            ctx.fillStyle='black';
          }
          if (400<i<500){
            ctx.fillStyle='red';
          }
          ctx.fill();
        }
      })

    }
  };
  
export const drawer = (prediction,ctx)=>{
    if (prediction.lenght > 0){
        prediction.forEach(pred=>{
            const points = pred.scaledMesh;
            for(let i=0; i < points.lenght;i++){
                const x = points[i][0]
                const y = points[i][1]

                ctx.beginPath();
                ctx.arc(x,y,1,0,3*Math.PI);
               
                if(i>250){
                    ctx.fillStyle='red';
                }else{
                    ctx.fillStyle='aqua';
                }
                ctx.fill();
            }
        })
        ctx.translate(ctx.width/2,ctx.height/2)
        ctx.scale(-1,1)
    }
}

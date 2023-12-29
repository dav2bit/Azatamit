export const profile = {
    drawPhoto(img , pfs){
        pfs.forEach(pf =>{
            var ctx = pf.getContext('2d');
            ctx.drawImage(img,0,0 ,pf.width ,pf.height);
        })
    }
}
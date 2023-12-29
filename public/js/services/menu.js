var navText = document.querySelectorAll(".navText");
var lessonTitle =  document.querySelector(".lesson-titles")

export const menu = {
    close(){

        document.body.classList.add("leftMenuClose")
        document.querySelector(".logo").innerHTML = "A"

        if(lessonTitle === null){
           
            for(var i = 0 ; i<navText.length ;  i++){
                navText[i].style.display = "none";
            }
        }else{
            document.querySelector(".navbar").style.display = 'block'
            document.querySelector('.lesson-titles').style.display = 'none'
        }
        setTimeout(()=>{
          

        },500)

    },
    
    open(){
        document.body.classList.remove("leftMenuClose")
        setTimeout(()=>{
            document.querySelector(".logo").innerHTML = "Azatamit"
            
            if(lessonTitle === null){
                for(var i = 0 ; i<navText.length ;  i++){
                    navText[i].style.display = "inline";
                }
            }else{
                document.querySelector(".navbar").style.display = 'flex'
                document.querySelector('.lesson-titles').style.display = 'block'

            }
            
        },500)
        
    }
    
}
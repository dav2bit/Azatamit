import {content} from '/services/content.js';

var slider = document.querySelector(".categories>ul")
var categorys = document.querySelector(".categories")
var category = slider.querySelectorAll("li")
var next   = document.querySelector(".next")
var last   = document.querySelector(".last") 
var popup = document.querySelector(".popup")
var position = 0    

content.draw(()=>{})

document.querySelector("#types").addEventListener('change',async (event) => {
    content.update()
});

category.forEach((el)=>{
    el.addEventListener("click",()=>{      
        content.update()
        
        category.forEach(element => {
            element.classList.remove("active")
         })

        el.classList.add("active")
        
    })
})

function changeSlide(sped){
    if(position===0){
        last.style.display = "flex"
       
    }
    position += sped
    slider.style=`transitionDuration : 0ms; transform: translate3d(${position}px, 0px, 0px)`;
}


next.addEventListener("click",()=>{
    changeSlide(-70)
    if(categorys.scrollWidth <= 836){
        next.style.display = "none"
        
    }
})

last.addEventListener("click",()=>{
    changeSlide(70) 
    next.style.display="flex"
    if(position>=0){
        last.style.display = "none"
    }

})

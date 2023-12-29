import { content } from "../services/content.js";
import { ajax } from "/services/ajax.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const courseID = urlParams.get('id')
var lessID = urlParams.get('lessonID');

ajax.postData('/content/getTitles' , {courseID : courseID }).then(data=>{
    if(lessID === null){
        lessID = data[0].ID   
    }
    data.forEach(elem =>{content.drowTitles(elem,courseID)})

    ajax.postData('/content/getLesson' , {lessonID : lessID}).then( data=>{
        
        
        document.querySelector('.lesson-title').innerHTML = data.title.toLowerCase()
        
        content.drowLesson(JSON.parse(data.Text))

        
        var isLiked = data.likedUsers.filter(u=> u.uID === parseInt(window.userID)).length > 0 ? true : false

        if(isLiked){
            document.querySelector("body > div.main > div.fxElems > div > div.like>i").classList.add("active")
        }

        document.querySelector("body > div.main > div.fxElems > div > div.like").addEventListener("click",()=>{
            content.like(`course${data.CourseID}`, document.querySelector("body > div.main > div.fxElems") )
            
        })
         
    })


})


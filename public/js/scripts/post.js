import {  ajax } from "/services/ajax.js";
import { content } from "../services/content.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const id = urlParams.get('id')
ajax.postData(`/content/getpost?id=${id}` , {}).then((res=>{
   
    const data = JSON.parse(res.Text)

    content.drowLesson(data)
    document.querySelector('.lesson-title').innerText = res.title

    var isLiked = res.likedUsers.filter(u=> u.uID === parseInt(window.userID)).length > 0 ? true : false

    if(isLiked){
        document.querySelector("body > div.main > div.fxElems > div > div.like>i").classList.add("active")
    }

    document.querySelector("body > div.main > div.fxElems > div > div.like").addEventListener("click",()=>{
        content.like(`post${res.ID}`, document.querySelector("body > div.main > div.fxElems") )
        
    })

})) 
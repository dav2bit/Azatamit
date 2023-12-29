import {  ajax } from "/services/ajax.js";
import { content } from "../services/content.js";

const urlParams = new URLSearchParams(window.location.search);
const courseID = urlParams.get('id');
const lessID = urlParams.get('lessonID');

var lessonID


await ajax.postData('/content/getCourse' , {courseID : courseID}).then( data=>{
    lessonID =  lessID === null ? data.FirstLessonID : lessID
    var lesson = data.lessons.find(element => element.ID ===  parseInt(lessonID));
    document.querySelector('.title>input').value = lesson.Title

    data.lessons.forEach(elem =>{content.drowTitles(elem,courseID,'edit')})
    
    editor.isReady.then(()=>{
        
        if(lesson.text === ''){
            return
        }

        editor.blocks.render({
            blocks:   JSON.parse(lesson.text).blocks
        })

    })
})

async function updatelesson(lessonID){
    let data = await editor.save()
    let err =   await  ajax.postData('/content/updatelesson' , {
            title: document.querySelector("body > div.main > div.center-panel > div > div.title > input[type=text]").value , 
            text:data,
            ID : lessonID
        })
    return err
}

document.querySelector('.add_lesson').addEventListener('click' ,async ()=>{
    //updatelesson
    let err = await updatelesson(lessonID)
    if(err.err!==''){
        alert(err.err)

    }else{
        //create new lesson  
        let answere = await ajax.postData('/content/createlesson' , {ID : courseID})
        
        //redirect
        window.location.replace(`/content/makeCourse?id=${courseID}&lessonID=${answere.lessonID}`);
    }

  
    
})
    

document.querySelector('.save_lesson').addEventListener('click' , async ()=>{
    let err = await updatelesson(lessonID)
    if(err.err!==''){
        alert(err.err)
    }else{
        alert('lesson saved')  
        window.location.replace(`/`);
    }
})


document.querySelector("body > div.main > div.center-panel > div > div.title > input[type=text]").addEventListener('input', (event) => {
    document.querySelector(`.n${lessonID}`).innerHTML =     document.querySelector("body > div.main > div.center-panel > div > div.title > input[type=text]").value 
});

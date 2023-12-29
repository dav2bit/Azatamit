import {content} from '/services/content.js';

fetch(`getlikedContent`).then((response) => response.json())
.then((data) => {
    content.draw(()=>{},data,'view')
});
/*
content.draw(()=>{
    const lessons = document.querySelectorAll('.lesson')
    lessons.forEach((lesson)=>{
        lesson.querySelector('.like').addEventListener('click',()=>{
            content.like(lesson.id , lesson )
        })
    })   
})*/
import {menu} from "/services/menu.js"
import {modal} from '/services/modal.js'
import {ajax} from '/services/ajax.js'
import {profile} from '/services/profile.js'
import {search} from '/services/content.js'

var menuIcon = document.querySelector(".menu");
var modalIcon = document.querySelectorAll(".modal-icon")
var makeCourse = document.querySelector(".makeCourse") 
var closeMakeCourse = document.querySelector(".makeCourseModal>.close")

if(window.innerWidth < 1497){menu.close()}

menuIcon.addEventListener("click",  () => document.body.classList.contains("leftMenuClose") ?  menu.open() : menu.close() )


if(isisAutenticated){
    
    var image = document.querySelector('.hidenPhoto');
    var pfs = document.querySelectorAll('.userPF')
    profile.drawPhoto(image , pfs)
    

    modalIcon.forEach(icon=>{
        icon.addEventListener("click",(el)=>{
            var modalEl = icon.nextElementSibling
            modalEl.style.display == "none" ? modal.open(modalEl) : modal.close(modalEl)
        })
    })
    
    
    let dataUrl = "/content/categorys"
    const searchBar =document.querySelector(".course-search-category");
    const list = document.querySelector("body > div.makeCourseModal > form > div > div")



    searchBar.addEventListener('input', (event) => {
        search.getData(dataUrl).then(el=>{
            let data = search.filterData(el , searchBar.value)
            if(searchBar.value !== '' && data.length !=0 ){
                document.querySelector('.course-category').style.display = 'block'
                search.drawData(data , list)
            }else{
                document.querySelector('.course-category').style.display = 'none'

            }


            var els = document.querySelectorAll("body > div.makeCourseModal > form > div > div > li")

            for(const elem of els){
                elem.addEventListener('click',(el)=>{
                    searchBar.value = elem.innerHTML
                    document.querySelector('.course-category').style.display = 'none'
                    
                })
            }
        })
    });


    makeCourse.addEventListener('click' , ()=> document.querySelector('.makeCourseModal').style.display = 'flex')
    closeMakeCourse.addEventListener('click' , ()=> document.querySelector('.makeCourseModal').style.display = 'none' )


    
    document.querySelector('.makeCourseModal>form').addEventListener('submit', async (e) => {
        e.preventDefault()
        var title =  document.querySelector("body > div.makeCourseModal > form > input[type=text]").value


        const response = await ajax.postData('/content/createCourse' , {courseName : title , category : searchBar.value})
        if(response.err !== ''){
            alert(response.err)
        }else{
            window.location.replace(`/content/makeCourse?id=${response.courseID}`);
        }
        /*
        let categorys =  await fetch('/content/categorys').then(res=>res.json())

        
        let cats =  categorys.categorys.filter(i=>i.Title === searchBar.value)

        let categoryID

        if(cats.length === 0){
            let data = await ajax.postData('/content/createCategory',{categoryName: searchBar.value})
            if(data.err!==''){
                alert(data.err)
                return
            }else{
                categoryID = data.id
            }
        }else{
            categoryID = cats[0].ID
        }
        var title =  document.querySelector("body > div.makeCourseModal > form > input[type=text]").value

        
        
        window.location.replace(`/content/makeCourse?id=${response.courseID}`);
        */
    });
 
    
}



document.querySelector("body > div.header > div.reight-panel > div.registered > div.user-setings > div > div > ul > li:nth-child(4)").addEventListener('click',()=>{
    if(localStorage.getItem("mood") === 'darck' || localStorage.getItem("mood") === null){
        localStorage.setItem("mood", "light");
        document.querySelector(':root').style.setProperty('--darck-gray', '#717b61'); 
        document.querySelector(':root').style.setProperty('--darck-background', '#ffffff18'); 
    }else{
        localStorage.setItem('mood' , 'darck')
        document.querySelector(':root').style.setProperty('--darck-gray', '#252526'); 
        document.querySelector(':root').style.setProperty('--darck-background', '#1E1E1E    '); 
       
    }
    
})


if(localStorage.getItem("mood") === 'darck' || localStorage.getItem("mood") === null){
    document.querySelector(':root').style.setProperty('--darck-gray', '#252526'); 
    document.querySelector(':root').style.setProperty('--darck-background', '#1E1E1E '); 
}else{
    document.querySelector(':root').style.setProperty('--darck-gray', '#717b61'); 
    document.querySelector(':root').style.setProperty('--darck-background', '#ffffff18'); 

   
}
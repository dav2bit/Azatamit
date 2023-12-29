import {  ajax } from "/services/ajax.js";
import {search} from '/services/content.js'
let dataUrl = "/content/categorys"
const searchBar =document.querySelector("body > div.main > div.center-panel > div > div:nth-child(2) > input[type=text]");
const list = document.querySelector("body > div.main > div.center-panel > div > div:nth-child(2) > div > ul");




searchBar.addEventListener('input', (event) => {
    search.getData(dataUrl).then(el=>{
        let categList = search.filterData(el , searchBar.value)
      
   
        if(searchBar.value !== '' && categList.length !== 0){
           
            document.querySelector("body > div.main > div.center-panel > div > div.select-category > div").style.display = 'block'
            
            search.drawData(search.filterData(el , searchBar.value) , list)
        }else{
            document.querySelector("body > div.main > div.center-panel > div > div.select-category > div").style.display = 'none'

        }

        var els = document.querySelectorAll("body > div.main > div.center-panel > div > div.select-category > div > ul > li")

        for(const elem of els){
        
             elem.addEventListener('click',(el)=>{
                 searchBar.value = elem.innerHTML
                 document.querySelector("body > div.main > div.center-panel > div > div.select-category > div").style.display = 'none'
             })
        }
    })
});





document.querySelector(".save").addEventListener("click",async el=>{

        const editorData = await  editor.save()
        let categorys =  await fetch('/content/categorys').then(res=>res.json())

        
        let cats =  categorys.categorys.filter(i=>i.Title === searchBar.value)

        let categoryID
        if(cats.length === 0){
            categoryID = await ajax.postData('/content/createCategory',{categoryName: searchBar.value})
        }else{
            categoryID = {id : cats[0].ID, err:''}
        }
        console.log(categoryID)
        console.log(editorData)
        console.log(document.querySelector("body > div.main > div.center-panel > div > div.title > input[type=text]").value)
        
        ajax.postData('/content/createpost' , {title: document.querySelector("body > div.main > div.center-panel > div > div.title > input[type=text]").value ,  text:editorData , category : [categoryID, searchBar.value]}).then(data=>{
            if(data.err !== ''){
                alert(data.err)
            }else{
                window.location.href = '/';
            }
        })
    
        
       

    })  

        

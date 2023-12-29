import {ajax} from "/services/ajax.js"
const urlParams = new URLSearchParams(window.location.search);
const postID = urlParams.get('id');

function updatePost(ID){
    editor.save().then((res) => {
        
        ajax.postData('/content/updatePost' ,{
            title: document.querySelector("body > div.main > div.center-panel > div > div.title > input[type=text]").value , 
            text: res,
            ID : ID
        }).then(res =>{
            if(res.err !== ''){
                alert(res.err)
            }else{
                debugger
                window.location.href = '/';
            }
        })

        })
}

ajax.postData(`/content/getpost?id=${postID}` , {}).then((res=>{
    if(res.err !== undefined){
        window.location.href = "/";
    }

    const data = JSON.parse(res.Text)
    editor.isReady.then(()=>{
        if(data === ''){
            return
        }  
        document.querySelector("body > div.main > div.center-panel > div > div.title > input[type=text]").value = res.title
        editor.blocks.render({
            blocks:  data.blocks
        })
    })

}))

document.querySelector("body > div.main > div.center-panel > div > button").addEventListener('click',()=>{
    updatePost(postID)
})
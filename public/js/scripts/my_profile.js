import { content } from "../services/content.js";
import {ajax} from "../services/ajax.js"
import {profile} from '/services/profile.js'
import {menu} from "/services/menu.js"



fetch('/user/getMyUser').then((response) => response.json())
.then((data) => {
    content.draw(()=>{},data.userProfile.Content)

    document.querySelectorAll("div.user-events > div.rud > button").forEach(elem =>{
        elem.addEventListener('click',el=>{
            
            let id = el.target.parentElement.parentElement.parentElement.parentElement.id;
            let type = id.replace(/[^a-z]/gi, '')
            
            ajax.postData("/content/delete" ,{custId:id,type:type})
            window.location.replace("/");

        })
    })
});

var pfs = document.querySelectorAll('.userPF')

let fileInput = document.querySelector('.pf')


fileInput.addEventListener('change', function(ev) {
    if(ev.target.files) {
        let file = ev.target.files[0];
        var reader  = new FileReader();

        reader.onloadend = function (e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function(ev) {
            var canvas = document.getElementById('canvas');
            profile.drawPhoto(image , pfs)

        }
        
        }
        reader.readAsDataURL(file);

    }
})




menu.close()
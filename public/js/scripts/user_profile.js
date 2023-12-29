import { content } from "../services/content.js";
import {ajax} from "../services/ajax.js"
import {menu} from "/services/menu.js"
 
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const id = urlParams.get('id')

fetch(`/user/getUser?id=${id}`).then((response) => response.json())
.then((data) => {
    content.draw(()=>{},data.user.Content,'view')
});

menu.close()

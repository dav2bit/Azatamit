import { ajax } from '/services/ajax.js';
export const content = {

    apendLesson(autorName, title, description, type, id, isLiked,auterPhoto) {
        const lesson = document.createElement("div");
        lesson.classList.add("lesson");
        lesson.setAttribute('id', id);
        lesson.innerHTML = ` <div class="lesson-content">
        <div class="author-info">
            <div class="photo">
                <img src="/${auterPhoto}" alt="" width="100%">
            </div>

            <div class="name">${autorName}</div>
            
        </div>

        <h3 class="title">${title}</h3>

        <div class="description">
            ${description}
        </div>

        <div class="user-events">
            
            <a href="/content/${type}?id=${id.replace(/[^0-9]/g, '')}"><button class="read">read</button></a> 

            <div class="reactions">
                <div class="like "><i class="fa fa-thumbs-up  ${isLiked ? 'active' : ''}" aria-hidden="true"></i></div>
                <div class="share"><i class="fas fa-share"></i></div>
            </div>

        </div>

                            </div>`;

        document.querySelector(".lessons").appendChild(lesson)

    },

    apendLessonProfile(autorName, title, description, type, id, isLiked,auterPhoto) {
        const lesson = document.createElement("div");
        lesson.classList.add("lesson");
        lesson.setAttribute('id', id);
        lesson.innerHTML = ` <div class="lesson-content">
        <div class="author-info">
            <div class="photo">
                <img src="/${auterPhoto}" alt="" width="100%">
            </div>

            <div class="name">${autorName}</div>
            
        </div>

        <h3 class="title">${title}</h3>

        <div class="description">
            ${description}
        </div>

        <div class="user-events">
            
            <div class="rud">
                <a href="/content/${type}?id=${id.replace(/[^0-9]/g, '')}"><button class="read">read</button></a>
                 
                <a href="/content/${type === 'post' ? `updatepost?id=${id.replace(/[^0-9]/g, '')}` : `makeCourse?id=${id.replace(/[^0-9]/g, '')}`}"> <button class="edit">edit</button></a>
                <button class="delete">delete</button>

            </div>
           

            <div class="reactions">
                <div class="like "><i class="fa fa-thumbs-up  ${isLiked ? 'active' : ''}" aria-hidden="true"></i></div>
                <div class="share"><i class="fas fa-share"></i></div>
            </div>

        </div>

                            </div>`;

        document.querySelector(".lessons").appendChild(lesson)

    },
   
    async draw(alredy, content) {
  
        var contents
        
        if (arguments.length === 1) {
            contents = await ajax.postData('/content/getcontent', {})
            contents.forEach(content => {
                var likedUsers = content.likedUsers

                var isLiked = likedUsers.filter(u => u.uID === parseInt(window.userID)).length > 0 ? true : false

                this.apendLesson(content.autorName, content.title, content.Description, content.type, content.ID, isLiked , content.autorPhoto)
            })

        } else if (arguments.length === 2) {
            contents = content
       
            contents.forEach(content => {
                
                var likedUsers = content.likedUsers
                var isLiked = likedUsers.filter(u => u.uID === parseInt(window.userID)).length > 0 ? true : false

                this.apendLessonProfile(content.autorName, content.title, content.Description, content.type, content.ID, isLiked ,  content.autorPhoto)
            })
            
        }else if (arguments.length === 3) {
            contents = content
        
            contents.forEach(content => {
                var likedUsers = content.likedUsers

                var isLiked = likedUsers.filter(u => u.uID === parseInt(window.userID)).length > 0 ? true : false
            
                this.apendLesson(content.autorName, content.title, content.Description, content.type, content.ID, isLiked ,  content.autorPhoto)
        })    
        }

        alredy()
        popup = document.querySelector(".popup")
        const lessons = document.querySelectorAll('.lesson')
        lessons.forEach(lesson=>{
            lesson.querySelector(".share").addEventListener('click',ev=>{
                let link = lesson.querySelector('a').href
                popup.querySelector('input').value = link
                link = encodeURIComponent(link)
                popup.querySelectorAll('ul a')[0].href = `https://www.facebook.com/sharer/sharer.php?u=${link}`
                popup.querySelectorAll('ul a')[1].href = `http://www.twitter.com/share?url=${link}`

                
                popup.classList.toggle("show");
            })
        })
        lessons.forEach((lesson)=>{
            lesson.querySelector('.like').addEventListener('click',()=>{
                debugger

                this.like(lesson.id , lesson )
            })
        }) 

    },

    async update() {
        document.querySelector("body > div.main > div.center-panel > div > div.lessons").innerHTML = ''

        var contents = await ajax.postData('/content/getcontent', {})
        const type = document.querySelector("#types").value
        const category = document.querySelector("body > div.main > div.center-panel > div > div.filter > div.categories > ul > li.active").innerText

        if (type !== 'all') {
            contents = contents.filter(el => el.type === type)

        }

        if (category !== 'All') {
            contents = contents.filter(el => el.category === category)
        }

        contents.forEach(ct => {
            var likedUsers = ct.likedUsers

            var isLiked = likedUsers.filter(u => u.uID === parseInt(window.userID)).length > 0 ? true : false

            this.apendLesson(ct.autorName, ct.title, ct.Description, ct.type, ct.ID, isLiked , ct.autorPhoto)
        })

        popup = document.querySelector(".popup")
        const lessons = document.querySelectorAll('.lesson')
        lessons.forEach(lesson=>{
            lesson.querySelector(".share").addEventListener('click',ev=>{
                let link = lesson.querySelector('a').href
                popup.querySelector('input').value = link
                link = encodeURIComponent(link)
                popup.querySelectorAll('ul a')[0].href = `https://www.facebook.com/sharer/sharer.php?u=${link}`
                popup.querySelectorAll('ul a')[1].href = `http://www.twitter.com/share?url=${link}`

                
                popup.classList.toggle("show");
            })
        })
        lessons.forEach((lesson)=>{
            lesson.querySelector('.like').addEventListener('click',()=>{
                debugger

                this.like(lesson.id , lesson )
            })
        }) 
    },

    async like(id, el) {

        let answer = await ajax.postData('/content/likeContent', { id: id })

        if (answer.message !== 'ok') {
            alert(answer.message)
            return
        }

        if (!el.querySelector('div.like > i').classList.contains('active')) {
            el.querySelector('div.like > i').classList.add("active")
        } else {
            el.querySelector('div.like > i').classList.remove("active")
        }
    },

    drowLesson(data) {

        data.blocks.forEach(elem => {
            if (elem.type === "paragraph") {
                const para = document.createElement("p");
                para.innerHTML = elem.data.text
                document.querySelector('.post-text').appendChild(para);

            } else if (elem.type === "image") {
                const image = document.createElement("img");
                image.src = elem.data.file.url

                document.querySelector('.post-text').appendChild(image)
            }

        })
    },

    drowTitles(elem, courseID , mode) {
        if(mode === 'edit'){
            var link = `/content/makeCourse?id=${courseID}&lessonID=${elem.ID}`;
        }else{
            link = `/content/course?id=${courseID}&lessonID=${elem.ID}`;
        }
        var a = document.createElement('a');
        a.href = link;

        const li = document.createElement("li");
        li.classList.add(`n${elem.ID}`)
        a.appendChild(li)

        const node = document.createTextNode(elem.Title.toLowerCase());
        li.appendChild(node);

        document.querySelector(".lesson-titles").appendChild(a);

    }
}


export const search = {

    async getData(dataUrl) {
        try {
            let response = await fetch(dataUrl);
            let data = await response.json();
            return data.categorys.map(item => item.Title)
        } catch (error) {

        }
    },

    drawData(items , list) {

        list.innerHTML = ''
        items.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item;
            list.appendChild(li);
        });

    },

    filterData(data, term ) {
        
        return data.filter(item => {
            return item.includes(term)
        })
    }
}
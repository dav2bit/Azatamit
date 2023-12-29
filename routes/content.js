import express from "express";
import {content} from '../Services/contentServices.js'
import { user } from "../Services/userService.js";
import {validation} from '../Services/validationServices.js';
import Multer  from "multer"
import  path from 'path';

const storage = Multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
    
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 50 ) + "-"+ path.extname(file.originalname )
      cb(null, uniqueSuffix)
    }
})        

const upload = Multer({storage:storage})

const router = express.Router();


router.use(express.urlencoded({extended:true}))
router.use(express.json())


router.get('/', (req , res)=>{
    res.send('hi')
})


router.get("/course", async (req, res)=>{
    res.render('course') 
})

router.get("/liked", user.chackAutenticated, (req, res)=>{
    res.render('liked') 
})

router.get("/updatepost", user.chackAutenticated , async (req, res)=>{
    var ID = req.user.ID
    var postID = req.query.id
    var post = await content.post.get(postID)
    var autor = post.autorID
    if(autor == ID){
        res.render('updatePost') 
    }else{
        res.redirect('/user/myprofile');
    }

})

router.get("/post", async (req, res)=>{
    const id = req.query.ID
    res.render('post' , {id : id})
    
})

router.get("/makecourse" , user.chackAutenticated ,async (req, res)=>{
    var courseID = req.query.id
    var userid = req.user.ID
    var course = await content.course.get(courseID)
    if(course.autorId !== userid){
        res.redirect('/user/myprofile');
    }else{
        res.render('writelesson' , {courseID  : courseID})
    }
})

router.get("/writepost" , user.chackAutenticated  , (req, res)=>{ 
    res.render('write_post')
})

router.get("/categorys"  , (req, res)=>{
    content.categorys.get().then(resp=>{
        res.json({categorys : resp})
    })
})


router.post('/getTitles' , (req , res)=>{
    content.course.getTitles(req.body.courseID).then(data=>{
        res.json(data)
    })
})

router.post('/createCategory', async (req,res)=>{
    
    let categoryName = req.body.categoryName
    if(categoryName.length <= 0){
        res.json({err : "Category name is empty"})
    }else{
        let id = await content.categorys.create(categoryName)
        res.json({id:id , err:''})
    }

  

})
// services

router.post('/getcontent' , async(req , res)=>{
    content.get().then(content=>{
        res.json(content)
    })
} )

router.get('/getLikedcontent' , user.chackAutenticated , async(req , res)=>{
    var ID = req.user.ID
    user.getlikedContent(ID).then(content=>{
        res.json(content)
    })
} )

router.post('/likeContent',(req,res)=>{
    let contentID = req.body.id
    let userID = req.user !== undefined ? req.user.ID : undefined
    
    if(userID === undefined){
        res.json({message : 'no registered'})
        return
    }

    content.like(userID , contentID)
    res.json({message : 'ok'})


})

router.post("/createCourse" , user.chackAutenticated  , async (req, res)=>{

    var courseName = req.body.courseName
    var categoryName = req.body.category


    if(courseName.trim()===''){
        res.json({err:'course name is empty'});
    }else if(categoryName.trim()===''){
        res.json({err:'category name is empty'});
    }else{
        var categorys = await content.categorys.get()
        let category =  categorys.filter(c=>c.Title === categoryName)
        let id
        if(category.length === 0){
            id = await content.categorys.create(categoryName)
        }else{
            id = category[0].ID
        }
        var courseID
        await content.course.create(courseName , id , req.user.ID).then(resp=>{
            courseID = resp    
        }) 
        res.json({courseID : courseID , err:''});
    }
    
})

router.post("/createlesson" , user.chackAutenticated  ,async (req, res)=>{
    var courseID = parseInt(req.body.ID)
    
    content.lesson.create(courseID).then(resp=>{
        res.json({lessonID : resp})
    })
})

router.post("/createpost", upload.single("image"), (req , res)=>{  
    let err = validation.contentIsValid(req.body.title , req.body.category[1] , req.body.text.blocks)
    if(err !== ''){
        res.json({err :err}); 
    }
    else{
        console.log(`categorty ${req.body.category[0]}`)
        content.post.create(req.body.title , req.body.category[0].id ,req.user.ID  , JSON.stringify(req.body.text)) 
        res.json({err : ''});

    }
});


router.post("/getLesson" , async (req, res)=>{
   
    var lessonID = req.body.lessonID
    
    content.lesson.getOne(lessonID).then(data=>{
        res.json(data)
    })
})

router.post("/getPost", async (req, res)=>{
    var id = req.query.id
    var post = await content.post.get(id)
    console.log(post)
    res.send(post)
})

router.post("/getCourse", async (req, res)=>{
    var id = parseInt(req.body.courseID)
  
    var course = await content.course.get(id)
    res.send(course)
})


router.post("/updatePost", (req, res)=>{

    content.get(req.user.ID).then(async cont=>{
        var id = req.body.ID
        if(cont !== undefined){
            cont = cont.find(el=>{return parseInt(el.ID.replace(/[^0-9]/g,'')) === parseInt(id)})
        }
    
        let err = validation.contentIsValid(req.body.title , 'valid' , req.body.text.blocks)
      
        if(cont !== undefined && err === ''){
            content.post.update(req.body.title, JSON.stringify(req.body.text) ,  req.body.ID)
            res.json({err : ''});

        }else{
            res.json({err :err});
        }

    })

 
})

router.post("/updatelesson" ,  (req , res)=>{ 
    let err = validation.contentIsValid(req.body.title , 'category' , req.body.text.blocks)
    console.log(err)
    if(err !== ''){
        res.json({err :err});
        return;
    }else{
        content.lesson.update(req.body.title, JSON.stringify(req.body.text) , req.body.ID)
        res.json({err :''});
    }
});


router.post("/upload_files", upload.single("image"), (req , res)=>{

    var obj =  {
        "success" : 1,
        "file": {
            "url" : `/${req.file.filename}`,
        } 
    }
    res.json(obj);
    
});


router.post("/delete", user.chackAutenticated  ,  (req , res)=>{  
    var id =  req.body.custId   
    var type = req.body.type
    let idNum = id.replace(/[^1-9]/gi, '')

    content.get(req.user.ID).then(async cont=>{

        
        cont = cont.find(el=>{return el.ID === id})
        if(cont !== undefined){
            content.delete(id , type)
        }
       
    })
    
});



export default  router
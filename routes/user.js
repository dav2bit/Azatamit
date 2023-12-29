import express from "express";
import { user } from "../Services/userService.js";
import passport  from "passport";
import * as url from 'url';
import path from "path";
import passportLocal  from "passport-local";
import fileUpload from "express-fileupload";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const userRouter = express.Router();

userRouter.use(fileUpload());

passport.use(new passportLocal.Strategy({
    usernameField: 'login'
}, user.login))

passport.serializeUser((user , done)=>{
    done(null , user.ID)
})

passport.deserializeUser(user.deserialize)

//routs

userRouter.get("/signup", async (req, res)=>{
    res.render('signup', {errs: {}} ) 
})

userRouter.get("/login", async (req, res)=>{
    res.render('login' ) 
})

userRouter.get("/userprofile" , (req, res)=>{
    var ID = req.query.id


    user.get(parseInt(ID)).then(el=>{
        if(el == 'user not found'){
            res.json('user not found')
        }
        res.render('userprofile' , {userProfile : el})
    })
    
})

userRouter.get("/myprofile" , user.chackAutenticated , (req, res)=>{
    var ID = req.user.ID
    user.get(parseInt(ID)).then(el=>{
        res.render('myprofile' , {userProfile : el})
    })

})

// control posts

userRouter.get("/getUser" , (req, res)=>{
    var ID = req.query.id  === undefined ? 6  : req.query.id 
 
    user.get(parseInt(ID)).then(el=>{
        res.json({user : el})
    })
    
})

userRouter.get("/getMyUser" , user.chackAutenticated , (req, res)=>{
    var ID = req.user.ID
    user.get(parseInt(ID)).then(el=>{
      
        res.json( {userProfile : el})
    })
    
})

userRouter.post("/getUsers"  , (req, res)=>{
    user.get().then(users=>{
        res.json({users : users})
    })
})

userRouter.post("/signup" , async (req, res)=>{
    let users = await user.get()
    let isfind = users.find(user=>{return user.Usernaem == req.body.username})!== undefined

    var errs = {}
    if(req.body.fullname.trim() == ''){
        errs.emtyFullname = "empty name"
    }
    if(req.body.username.trim() == ''){
        errs.emptyUsername = "empty username"
    }
    if(req.body.password.trim() == ''){
        errs.emptyPassword = "empty password"
    }
    if(req.body.password.trim() == ''){
        errs.emptyMail = "empty mail"
    }
    if(!user.mailIsValid(req.body.mail)){
        errs.invalMail = "invalid mail"
       
    }
    if(isfind){
        errs.invalUsername = "username already exist"
    }

    console.log(Object.keys(errs).length)
    if(Object.keys(errs).length !== 0){

        res.render("signup" , {errs: errs})
    
    }else{
        const newUser = await user.register(req.body.fullname , req.body.username , req.body.password , req.body.mail)
        req.login(newUser, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
        
    }



    
})


userRouter.post("/login", passport.authenticate('local' , {
    successRedirect : "/",
    failureRedirect : "/user/login",
}))


userRouter.post("/logout", (req , res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/user/login');
    });
})


userRouter.post('/update', (req , res)=>{
    
    try{
        
        const {profilePhoto} = req.files;
        
        const photoName = `${Date.now()}-${Math.round(Math.random() * 50 )}-${profilePhoto.name}`

        profilePhoto.mv(process.cwd() + '/public/profilePhotos/' + photoName);
        
        user.update(req.body.fullName , req.body.description , req.user.ID  , photoName)

    }catch{
        user.update(req.body.fullName , req.body.description , req.user.ID , req.user.photo)
    }
    res.json({message : 'ok'});
    
})

export default  userRouter
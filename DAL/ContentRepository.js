import {pool} from "./connection.js";

//control courses
export const courseRep = { 
    
    async get(){
        if(arguments.length === 0){
            const res = await pool.query( `
            select cu.ID, cu.Title , cg.Title as categoryTitle , u.FullName , cu.userID ,  u.photo
            from Courses  as cu
            inner Join categorys as cg
            On category_ID = cg.ID inner Join 
            users as u
            On  UserID = u.ID`)
            return res[0]
        }else if(arguments.length === 1){
            const res = await pool.query( `
            select cu.ID, cu.Title , cg.Title as categoryTitle , u.FullName , cu.userID
            from Courses  as cu
            inner Join categorys as cg
            On category_ID = cg.ID inner Join 
            users as u
             On  UserID = u.ID
            where cu.ID = ?` , [arguments[0]])
            return res[0]
        }
    },

    async getTitles(courseID){
        const res = await pool.query( `select ID , Title from lessons where courseID = ?` , [courseID])
        return res[0]
    },



    async create(Title , Category_ID , User_ID){

        const res = await pool.query( `insert into courses (Title , Category_ID , UserID ) values (? , ? , ?);` , [Title , Category_ID , User_ID])    
        return res[0].insertId
    },

    async deleta(ID){ 
    
        await pool.query(`DELETE FROM lessons WHERE courseID = ?` , [ID]);
        const res = await pool.query( `DELETE FROM courses WHERE ID=?;` , [ID])
    },

    async likedUsers(contentID){
        const res = await pool.query( `select users.ID as uID, users.fullName  from likes 
        INNER JOIN users  
        on userID = users.id  where contentID=? && contentType = 'course' 
        ` , [contentID])
        return res[0]
        
    },

    async like(userID,contentID){
        var isLiked = await pool.query(` select * from likes where userID = ? && contentID = ? && contentType ='course'`,[userID,contentID])
        isLiked = isLiked[0].length ===0 ? true : false
      

        if(isLiked){
            pool.query(`insert into likes (userID, contentID, contentType) values (? , ? , 'course')` , [userID,contentID])
        }else{
            pool.query(`delete from likes where userID = ? && contentID = ?` , [userID,contentID])
        }
    },

    async liked(userID){
        const res = await pool.query( `SELECT  lk.ID, lk.userID, lk.contentID, lk.contentType,u.FullName,u.photo,c.Title  FROM likes  as lk
        inner join users as u 
        on userID=u.ID
        inner join courses as c
        on contentID = c.ID && contentType='course'
        where lk.userID = ?
        ` , [userID])
        return res[0]
    }
}



export const lessonRep = {

    async get(categoryID){
        const res = await pool.query( `select l.ID, l.Title , l.text , c.ID as cID
        from Lessons  as l
        inner Join Courses as c
        On l.CourseID = c.ID
        where c.ID = ?` , [categoryID])
        return res[0]
    },

    async getOne(lessonID){
        const res = await pool.query( `select * from lessons where ID = ?` , [lessonID])
        return res[0]
    },

    async create(Title , CText , CourseID){
        const res = await pool.query( `insert into lessons (Title , Text , CourseID ) values (? , ? , ?);` , [Title , CText , CourseID])
        return res[0].insertId
    },

    async update(Title , CText , ID ){
        const res = await pool.query( `UPDATE lessons SET Title = ? , Text = ? WHERE ID = ?;` , [Title , CText , ID ])
    }
}

export const postRep  ={
    async get(){
        if(arguments.length === 0){
            const res = await pool.query( `select p.ID, p.Title , c.Title  as categoryTitle , u.FullName , p.User_ID as UserID ,  p.Text, p.Description,u.photo
            from Posts  as p
            inner Join categorys as c
            On category_ID = c.ID inner Join 
            users as u
             On  User_ID = u.ID`)
            return res[0]
        }else if(arguments.length === 1){
            const res = await pool.query( `select p.ID, p.Title , c.Title  as categoryTitle , u.FullName , p.Text  ,  u.ID as userID
            from Posts  as p
            inner Join categorys as c
            On category_ID = c.ID inner Join 
            users as u
            On  User_ID = u.ID
            where p.ID = ?` , [arguments[0]])
            return res[0]
        }
    
    },

    async create(Title , Category_ID , User_ID , Text , description){
        const res = await pool.query( `insert into posts (Title , Category_ID , User_ID , Text , Description) values (? , ? , ? , ? , ?);` , [Title , Category_ID , User_ID , Text , description])
    },

    async delete(ID){
        await pool.query(`DELETE FROM posts WHERE ID = ?` , [ID]);
    },

    update(Title , CText , ID){

        pool.query(`UPDATE posts SET Title = ? , Text = ? WHERE ID = ?;` , [Title , CText,  ID]);
      
    },

    async likedUsers(contentID){
        const res = await pool.query( `select users.ID as uID, users.fullName  from likes 
        INNER JOIN users  
        on userID = users.id  where contentID=? && contentType = 'post' 
        ` , [contentID])
        return res[0]
        
    },

    async like(userID,contentID,contentType){

        var isLiked = await pool.query(` select * from likes where userID = ? && contentID = ? && contentType = 'post';`,[userID,contentID])
        isLiked = isLiked[0].length ===0 ? true : false
      

        if(isLiked){
            pool.query(`insert into likes (userID, contentID, contentType) values (? , ? , 'post')` , [userID,contentID])
        }else{
            pool.query(`delete from likes where userID = ? && contentID = ?` , [userID,contentID])
        }
        
    },
    async liked(userID){
        const res = await pool.query( `SELECT  lk.ID, lk.userID, lk.contentID, lk.contentType,u.FullName,u.photo,p.Title,p.Text  FROM likes  as lk
        inner join users as u 
        on userID=u.ID
        inner join posts as p
        on contentID = p.ID && contentType='post'
        where lk.userID = ?
        ` , [userID])
        return res[0]
    }
}


export const categorysRep ={
    async get(){
        const res = await pool.query(`select * from categorys`)
        return res[0]
    },
    
    async create(title){
       var res = await  pool.query(`insert into categorys(Title) values (?);` , [title])
       return res[0].insertId
    }
 
}


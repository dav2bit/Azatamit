import {pool} from "./connection.js";

export const userRep ={
    async get(){
        if(arguments.length === 2){
            const res = await pool.query( `select * from users where username = ?` , [arguments[0]])
            return res[0]
        }else if(arguments.length === 1){
            const res = await pool.query( `select * from users where ID = ?`, [arguments[0]])
            return res[0]
        }else if(arguments.length === 0){
            const res = await pool.query( `select * from users`)
            return res[0]
        }
    },
    async getLikeCount(){
        const res = await pool.query( `SELECT COUNT(*) FROM likes as l inner join courses as c  on l.userID = c.ID and l.contentType='course' where l.userID = ?`, [arguments[0]])
        const res1 = await pool.query( `SELECT COUNT(*) FROM likes as l inner join posts as p  on l.userID = p.ID and  l.contentType='post' where l.userID = ?`, [arguments[0]])

        return res[0][0]['COUNT(*)']+res1[0][0]['COUNT(*)']
    },
    async create(fullName , username , password , mail){
        const res = await pool.query( `insert into users (FullName , Username, Password , Mail , photo  ) Values (? , ?, ? , ? , ?);` , [fullName , username , password , mail , 'pfp.jpg'])
        return res[0].insertId
    },

    async update(fullName , description ,  UserID , photoName){
        await pool.query( `UPDATE users
        SET FullName = ?, Description = ? , photo = ?
        WHERE ID = ?;` , [fullName , description ,  photoName , UserID])
        
    }
    
    
}

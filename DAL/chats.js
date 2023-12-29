import {pool} from "./connection.js";


export const charsRep = { 
    async get(){
        const res = await pool.query( `
            select * from chats`)
            return res[0]  
    },

    async isContains(ID){
        const res = await pool.query( `
            select * from chats where ID = ?` , [ID])
           
            return res[0].length > 0 
    },

    messages : {

        async get(chatID){
            const res = await pool.query( `
            select messages.id ChatID , UserID , MText , users.Username , photo from messages INNER JOIN users
            ON UserID =users.ID where ChatID = ?;` , [chatID])
            return res[0]  
        },
        
        create(chatID , userID ,  text){
            
            pool.query(`insert into messages(ChatID , UserID , MText , Date) values (? , ? , ? , NOW() );` , [chatID , userID , text])

        }
    },
}

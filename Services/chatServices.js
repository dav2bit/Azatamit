import {charsRep} from '../DAL/chats.js'



export const chats = {
    async get(){
        const chats = await charsRep.get()
        return chats

    },

    async isContains(ID){
        return await charsRep.isContains(ID)     
    },

    messages : {
        async get(chatID){

            const messages = await charsRep.messages.get(chatID)

            return messages
        },

        create(chatID , userID , text){
            charsRep.messages.create(chatID , userID ,  text)
            

        }
    },


}

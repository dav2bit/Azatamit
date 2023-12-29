export const validation = {
    contentIsValid(title,category,text){
        let err = ''
        if(title.trim()===''){
            err = 'title is empty'
        }else  if(category.trim()===''){
            err = 'category is empty'
        }else  if(text.length==0){
            err = 'content is empty'
        }
        return err
    }
}
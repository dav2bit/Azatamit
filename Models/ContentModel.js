export function ContentModel(ID , type, title ,  category , autorName , auterID, description = '' , likedUsers,authorPhoto ){
    this.ID = ID
    this.type = type
    this.title = title
    this.category = category
    this.autorName = autorName
    this.auterID = auterID
    this.Description = description
    this.likedUsers = likedUsers
    this.autorPhoto = authorPhoto
}

export function PostModel(ID , title ,  category , autorName , Text = '' , autorID,likedUsers){
    this.ID = ID
    this.title = title
    this.category = category
    this.autorName = autorName
    this.Text = Text
    this.autorID = autorID
    this.likedUsers = likedUsers

}

export function LessonModel(ID , title , Text = '',likedUsers,CourseID){
    this.ID = ID
    this.title = title
    this.Text = Text
    this.likedUsers=likedUsers
    this.CourseID=CourseID

}

export function CourseModel(ID , FirstLessonID , title , lessons,autorid){
    this.ID = ID
    this.FirstLessonID = FirstLessonID
    this.title = title
    this.autorId = autorid
    this.lessons = lessons
}
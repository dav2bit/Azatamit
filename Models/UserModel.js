export function UserModel(ID, Usernaem, FullName, Description, Content, Photo,LikesCount) {
    (this.ID = ID),
    (this.FullName = FullName),
    (this.Usernaem = Usernaem),
    (this.Description = Description),
    (this.Content = Content);
    this.Photo = Photo;
    this.LikesCount = LikesCount;

}

import {
  courseRep,
  postRep,
  lessonRep,
  categorysRep,
} from "../DAL/ContentRepository.js";
import {
  ContentModel,
  CourseModel,
  PostModel,
  LessonModel
} from "../Models/ContentModel.js";
import { user } from "./userService.js";

export const content = {
  async get() {
    var content = [];
    var courses = await courseRep.get();
    var posts = await postRep.get();

    for (var course of courses) {
      var likedUsers = await courseRep.likedUsers(course.ID);
      content.push(
        new ContentModel(
          `course${course.ID}`,
          "course",
          course.Title,
          course.categoryTitle,
          course.FullName,
          course.userID,
          "",
          likedUsers,
          course.photo
        )
      );
    }

    for (var post of posts) {
      var likedUsers = await postRep.likedUsers(post.ID);
      var description = "";

      JSON.parse(post.Text).blocks.forEach((elem) => {
        if (elem.type === "paragraph") {
          description += elem.data.text;
        }
      });
      content.push(
        new ContentModel(
          `post${post.ID}`,
          "post",
          post.Title,
          post.categoryTitle,
          post.FullName,
          post.UserID,

          `${description.slice(0,500)}...`,
          likedUsers,
          post.photo,
        )
      );
    }

    if (arguments.length === 0) {
      return content;
    } else if (arguments.length === 1) {
      return content.filter((el) => el.auterID === arguments[0]);
    }
  },

  delete(id, contentType) {
    if (contentType == "course") {
      courseRep.deleta(id.replace(/[^0-9]/g, ""));
    } else {
      postRep.delete(id.replace(/[^0-9]/g, ""));
    }
  },

  like(userID, contentID) {
    var contentType = contentID.replace(/[^a-z]/g, "");
    var contentID = contentID.replace(/[^0-9]/g, "");
    contentType !== "post"
      ? courseRep.like(userID, contentID)
      : postRep.like(userID, contentID);
  },

  course: {
    async get(ID) {
      var courseModel;

      var course = await courseRep.get(ID);
      course = course[0];

      var lessons = await lessonRep.get(ID);


      courseModel = new CourseModel(
        course.ID,
        lessons[0].ID,
        course.Title,
        lessons,
        course.userID,

      );

      return courseModel;
    },

    async getTitles(courseID){
      const res = await courseRep.getTitles(courseID)
      return res
    },

    async create(Title, Category_ID, User_ID) {
      var courseID = await courseRep.create(Title, Category_ID, User_ID);
      await lessonRep.create("first lesson", "", courseID);
      return courseID;
    },
  },

  lesson: {
    async create(courseID) {
      const res = await lessonRep.create("", "", courseID);
      return res;
    },

    async getOne(lessonID){


      const lesson = await lessonRep.getOne(lessonID)
      var likedUsers = await courseRep.likedUsers(lesson[0].CourseID);
      return new LessonModel(lesson[0].ID,lesson[0].Title,lesson[0].Text,likedUsers,lesson[0].CourseID)
      
    },

    async update(Title, CText, ID) {
      lessonRep.update(Title, CText, ID);
    },
  },

  post: {
    async get(postID) {
      let postModel;

      let post = await postRep.get(postID);
      post = post[0];
      var likedUsers = await postRep.likedUsers(post.ID);
      postModel = new PostModel(
        post.ID,
        post.Title,
        post.categoryTitle,
        post.FullName,
        post.Text,
        post.userID,
        likedUsers
      );

      return postModel;
    },

    create(Title, Category_ID, User_ID, Text) {
      postRep.create(Title, Category_ID, User_ID, Text, "");
    },

    update(Title, CText, ID) {
      postRep.update(Title, CText, ID);
    },
  },

  categorys: {
    async get() {
      var categorys = await categorysRep.get();
      return categorys;
    },

    async create(name){
       const res =await categorysRep.create(name)
       return res

    }
  },
};

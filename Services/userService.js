import { userRep } from "../DAL/UserRepository.js";
import { content } from "./contentServices.js";

import { ContentModel } from "../Models/ContentModel.js";
import { courseRep , postRep } from "../DAL/ContentRepository.js";

import { UserModel } from "../Models/UserModel.js";
import bcrypt from "bcrypt";

export const user = {
  async register(fullName, username, password, mail) {
    let bcPass = await bcrypt.hash(password, 10);
    const userID = await userRep.create(fullName, username, bcPass, mail);
    return await this.get(userID);
  },

  async get(ID) {
    if (arguments.length == 1) {
      var userModel;
      try {
        var user = await userRep.get(ID);
        var contentModel = await content.get(ID);
      } catch (err) {
        return "user not found";
      }

      var likeCount = 0;
      contentModel.forEach((el) => {
        likeCount += el.likedUsers.length;
      });

      user = user[0];

      userModel = new UserModel(
        user.ID,
        user.Username,
        user.FullName,
        user.Description,
        contentModel,
        user.photo,
        likeCount
      );

      return userModel;
    } else if (arguments.length == 0) {
      var users = await userRep.get();
      var userModals = [];
      users.forEach((user) => {
        userModel = new UserModel(
          user.ID,
          user.Username,
          user.FullName,
          user.Description,
          contentModel,
          user.photo
        );
        userModals.push(userModel);
      });
      return userModals;
    }
  },

  async getlikedContent(userID) {
    var courses = await courseRep.liked(userID);
    var posts = await postRep.liked(userID);
    var content = [];
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

          `${description.slice(0, 500)}...`,
          likedUsers,
          post.photo
        )
      );
    }
    return content;
  },

  async update(fullName, description, UserID, photoName) {
    userRep.update(fullName, description, UserID, photoName);
  },

  async deserialize(id, done) {
    var user = await userRep.get(id);

    user = user.length > 0 ? user[0] : undefined;

    done(null, user);
  },

  chackAutenticated(req, res, next) {
    if (req.isAuthenticated() === false) {
      return res.redirect("/user/login");
    }
    next();
  },

  mailIsValid(email) {
    return (
      String(email)
        .toLowerCase()
        .match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) !== null
    );
  },

  async login(login, password, done) {
    
    var user = await userRep.get(login, password);
    user = user.length > 0 ? user[0] : undefined;

    if (user === undefined || !(await bcrypt.compare(password , user.Password))) {
      return done(null, null, { message: "incorect user or password" });
    }

    return done(null, user);
  },
};


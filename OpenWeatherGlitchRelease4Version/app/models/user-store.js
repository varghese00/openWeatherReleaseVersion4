"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const userStore = {
  store: new JsonStore("./models/user-store.json", { users: [] }),
  collection: "users",

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    this.store.add(this.collection, user);
    this.store.save();
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserByEmail(email, password) {
    return this.store.findOneBy(this.collection, {
      email: email,
      password: password
    });
  },

  getUser(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  updateUser(user, editedUser) {
    user.firstName = editedUser.firstName;
    user.lastName = editedUser.lastName;
    user.email = editedUser.email;
    user.password = editedUser.password;
    this.store.save();
  }
};

module.exports = userStore;
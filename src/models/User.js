"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../lib/helpers");
var users = [];
var User = /** @class */ (function () {
    function User(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
    User.prototype.create = function () {
        this.id = (0, helpers_1.getID)();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.deletedAt = null;
        this.emailVerified = false;
        return this;
    };
    User.prototype.save = function () {
        users.push(this);
    };
    User.find = function () {
        return users;
    };
    User.findById = function (id) {
        return users.find(function (user) { return user.id === id; });
    };
    return User;
}());
var user = new User("Abhishek", "abhi@gmail.com", "password");
var user1 = new User("Somesh", "somesh@gmail.com", "13oiuoisu");
user.create().save();
user1.create().save();
console.log(User.find());

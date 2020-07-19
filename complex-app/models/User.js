const validator = require("validator")
const userCollection = require('../db').db().collection('users')
const bcrypt = require('bcryptjs')
let User = function(data) {
    this.data = data
    this.error = []
}
User.prototype.cleanUp = function() {
    if(typeof(this.data.username) != "string") {
        this.data.username = ""
    }
    if(typeof(this.data.email) != "string") {
        this.data.email = ""
    }
    if(typeof(this.data.password) != "string") {
        this.data.password = ""
    }
    // get rid of bogus 
    this.data = {
        username : this.data.username.trim().toLowerCase(),
        email : this.data.email.trim().toLowerCase(),
        password : this.data.password
    }
}

User.prototype.validate = async function() {
    if(this.data.username == "") {
        this.error.push("Provide Username")
    }
    if(this.data.username != "" && !validator.isAlphanumeric(this.data.username))  {
        this.error.push("Provide valid Username")
    }
    if(!validator.isEmail(this.data.email)) {
        this.error.push("Provide valid email")
    }
    if(this.data.password == "") {
        this.error.push("Provide password")
    }
    if(this.data.password.length > 0 && this.data.password.length < 12) {
        this.error.push("Password must be 12 char")
    }
    if(this.data.password.length > 50) {
        this.error.push("Password cannot exceed 50 char")
    }
    if(this.data.username.length > 0 && this.data.username.length < 3) {
        this.error.push("Username must be 3 char")
    }
    if(this.data.username.length > 100) {
        this.error.push("Username cannot exceed 100 char")
    }

    // user is valid or taken
    if(this.data.username.length > 2 
        && this.data.username.length  > 31 && validator.isAlphanumeric(this.data.username)) {
            let usernameExists = await userCollection.findOne({username : this.data.username})
            if(usernameExists) {this.error.push("Username is already taken")}
    }
    if(validator.isEmail(this.data.email)) {
            let emailExists = await userCollection.findOne({username : this.data.email})
            if(emailExists) {this.error.push("email is already taken")}
    }
    
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp();
        userCollection.findOne({username : this.data.username})
        .then((attemptedUser) => {
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                resolve("Congratss!!")
            } else {
                reject("Invalid User")
            }
        }).catch(() => {
            reject("Please try again!")
        })
    })
}

User.prototype.register = function() {
    // Step : 1 : Validate User data
    this.cleanUp()
    this.validate()

    // Step : 2 : only no errors, save to database
    if(!this.error.length) {
        //Hashing
        let salt = bcrypt.genSaltSync(10);
        this.data.password = bcrypt.hashSync(this.data.password, salt)
        userCollection.insertOne(this.data)
    }

}
module.exports = User
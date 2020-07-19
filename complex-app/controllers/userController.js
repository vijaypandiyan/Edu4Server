const User = require('../models/User')

exports.login = function(req, res) {
    console.log(req.body)
    let user = new User(req.body)
    
    user.login().then(function(result) {    
        console.log("user : "+user.data.username)
        console.log("password : "+user.data.password)
        req.session.user = {username : user.data.username}
        console.log("session : "+req.session.user.username)
        req.session.save(function() {
            res.redirect('/')
        })
        
    }).catch(function(e) {
        req.flash('errors', e)
        //res.session.save(function() {
            res.redirect('/')
       // })

    })
    
}
exports.logout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/')
    })
    
}
exports.register = function(req, res) {
    let user = new User(req.body)
    user.register()
    console.log(user.error)
    if(user.error.length) {
        user.error.forEach(function(error) {
            req.flash('regErrors', error)
        })
        req.session.save(function() {
            res.redirect('/')
        })
    } else {
        req.session.user = {username : user.data.username}
        res.redirect('/')
        //res.send("Validation Success")
    }
}
exports.home = function(req, res) {
    if(req.session.user) {
        res.render('home-dashboard', {username : req.session.user.username})
    } else {
        res.render('home-guest', {errors : req.flash('errors'), regErrors : req.flash('regErrors')})
    }
}
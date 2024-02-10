const { render } = require('ejs');

const collection = require('../model/mongodb');

const bcrypt = require('bcrypt')

const { compare, hash } = require('bcrypt');

const validator = require('email-validator');





const user_signupGet = (req, res) => {

    if (req.session.isAuthLogin) {

        res.redirect('/home')
    } else {

        const message = req.session.emailError || req.session.userExist

        res.render('signup', { msg: message })
    }

}

const user_signupPost = async (req, res) => {

    const email = req.body.email

    const emailValidate = validator.validate(email)

    console.log(emailValidate)

    if (emailValidate) {

        const name = req.body.name

        console.log(name, 'hai')

        const trimmedName = name.trim()

        console.log(trimmedName, 'hello')

        const userAlready = await collection.findOne({ name: trimmedName }, { _id: 0, name: 1 })

        console.log(userAlready)

        if (userAlready === null) {

            const hashPassword = await bcrypt.hash(req.body.password, 10)

            const data = {

                name: trimmedName,

                password: hashPassword,

                email: req.body.email

            }
            console.log('recieved')

            await collection.insertMany([data])

            res.redirect('/login')

        } else if (userAlready !== null) {

            if (trimmedName === userAlready.name) {

                req.session.userExist = 'username already exist please try another username'

                res.redirect('/signup')
            }
        }

    } else {

        req.session.emailError = 'email id is not valid try again'

        res.redirect('/signup')
    }

}



//NOTE - ============================================               LOGIN ROUTE          ===================================================//

//!SECTION ===========================================               USER LOGIN ROUTE                 ======================================================================================

const user_loginGet = (req, res) => {

    if (req.session.isAuthLogin) {

        res.redirect('/home')

    } else {

        const message = req.session.loginError                                                                       //NOTE - login message error

        const logoutMsg =  req.session.logoutMsg

        res.render('login', { loginerror: message , logoutMsg: logoutMsg})

    }
}


//!SECTION================================================           USER LOGIN POST METHOD           ====================================================================================================================================

const user_loginPost = async (req, res) => {

    try {

        const name = req.body.name

        const email = req.body.email

        console.log(email)

        const trimmedName = name.trim()

        const hashPassword = await collection.findOne({ name: trimmedName }, { _id: 0, password: 1 })               //NOTE -  Finding hashed password in Database

        console.log(hashPassword)

        const database = await collection.findOne({ name: trimmedName }, { _id: 0 })                                //NOTE - Finding name in Database


        console.log(database)

        if (database === null || hashPassword === null) {

            req.session.loginError = 'Invalid User Entry'                                                            //NOTE - user is not valid error

            res.redirect('/login')

        }
        console.log("login entered")

        console.log(trimmedName)

        console.log(hashPassword)

        if (database !== null && hashPassword !== null) {

            const comparedHashPassword = await bcrypt.compare(req.body.password, hashPassword.password)                     //NOTE - Comparing hashed password   

            console.log(comparedHashPassword)

            const data = {

                name: trimmedName,

                email: email

            }


            if (data.name === database.name && comparedHashPassword) {

                req.session.usernameHome = data.name

                console.log("success")

                req.session.isAuthLogin = true

                res.redirect('/home')

            } else {

                req.session.loginError = 'Check the username or password'

                res.redirect('/login')

            }
        }

    } catch (err) {

        console.log(err.message)

    }
}







const user_home1 = (req, res) => {

    if (req.session.isAuthLogin) {

        const uname = req.session.usernameHome

        res.render('home', { usernameHome: uname })

    } else {

        res.redirect('/login')

    }

}

const user_home2 = (req, res) => {

    if (req.session.isAuthLogin) {


        res.redirect('/home')

    } else {

        res.redirect('/login')

    }

}

const user_logout = (req, res) => {
    
    req.session.destroy()
    
    res.redirect('/login')

    res.status(200).send('logout succesully')
    
}

//LINK - ===============================================================           ROUTER EXPORTING           ===============================================================//


module.exports = {


    user_signupGet,
    user_signupPost,
    user_loginGet,
    user_loginPost,
    user_home1,
    user_home2,
    user_logout,

}
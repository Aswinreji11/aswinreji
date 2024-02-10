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

    const userEmail = req.body.email

    const emailValidate = validator.validate(userEmail)

    console.log(emailValidate)

    if (emailValidate) {


        const userAlready = await collection.findOne({ email: userEmail }, { _id: 0, email: 1 })

        console.log(userAlready)

        if (userAlready === null) {

            const hashPassword = await bcrypt.hash(req.body.password, 10)

            const data = {

                name: req.body.name,

                password: hashPassword,

                email: userEmail

            }
            console.log('recieved')

            await collection.insertMany([data])

            res.redirect('/login')

        } else if (userAlready !== null) {

            if (data.email === userAlready.email) {

                req.session.userExist = 'Email Id already exist please try another email id'

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


        const userEmail = req.body.email

        console.log(userEmail)



        const hashPassword = await collection.findOne({ email: userEmail }, { _id: 0, password: 1 })               //NOTE -  Finding hashed password in DataBase

        console.log(hashPassword)

        const dataBase = await collection.findOne({ email: userEmail }, { _id: 0 })                                //NOTE - Finding name in DataBase


        console.log(dataBase)

        if (dataBase === null || hashPassword === null) {

            req.session.loginError = 'Invalid User Entry'                                                            //NOTE - user is not valid error

            res.redirect('/login')

        }
        console.log("login entered")

        console.log(userEmail)

        console.log(hashPassword)

        if (dataBase !== null && hashPassword !== null) {

            const comparedHashPassword = await bcrypt.compare(req.body.password, hashPassword.password)                     //NOTE - Comparing hashed password   

            console.log(comparedHashPassword)

            const data = {

                email: userEmail,

                name:dataBase.name

            }


            if (data.email === dataBase.email && comparedHashPassword) {

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

        const userName = req.session.usernameHome

        res.render('home', { usernameHome: userName })

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
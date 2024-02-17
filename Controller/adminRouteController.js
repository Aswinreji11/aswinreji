
const collection = require('../model/mongodb')

const bcrypt = require('bcrypt')

const validator = require('email-validator');

const {isValidName,isValidPassword,isvalidEmail} = require('../validation/validation')




const admin_loginGet = (req, res) => {

    if (req.session.isAuth) {

        res.redirect('/admin/users')

    } else {

        const message = req.session.adminError

        const name = req.session.adminName

        const adminLoginError = req.session.adminLoginError

        res.render('admin', { errMsg: message, loginErrorAdmin: adminLoginError, name: name })

    }

}

const admin_loginPost = async (req, res) => {

    try {

        const data = {

            email: req.body.email,

            password: req.body.password
        }



        if(!isvalidEmail(data.email)){
            return res.render('admin',{errMsg : 'Email is not valid'})
        }

        if(!isValidPassword(data.password)){
            return res.render('admin',{errMsg:'password must contain one letter and one number atleast 8 characters'})
        }
        

        
        console.log(data, 'data is ')

        const userData = await collection.findOne({ email: data.email }, {})

        console.log(userData)

        const hashPassword = await collection.findOne({ email: data.email }, { _id: 0, password: 1 })

        console.log(userData, 'userdata')

        console.log(hashPassword, 'hashpassword')


        if (userData === null || hashPassword === null || userData.isAdmin === false) {

            req.session.adminError = 'Invalid admin or password'

            res.redirect('/admin')
        }



        else if (userData.email !== null && hashPassword !== null && userData.isAdmin === true) {

            const comparedHashPassword = await bcrypt.compare(req.body.password, hashPassword.password)

            console.log(comparedHashPassword)

            const data = {

                email: req.body.email,

                name: userData.name,

                password: comparedHashPassword

            }

            req.session.adminName = data.name

            if (userData.email === data.email && comparedHashPassword) {

                req.session.isAuth = true

                res.redirect('/admin/users')

            } else {

                res.redirect('/admin')
            }

        }

    } catch (err) {

        console.log('error caught' + err)

    }

}





const admin_userPage = async (req, res) => {

    if (req.session.isAuth) {

        const userData = await collection.find({ isAdmin: false }, { _id: 0 })



        const adminName = req.session.adminName

        const userDeleted = req.session.userDeleted

        const userSearchData = req.body.userSearchData


        res.render('adminHome', { user: userData, adminName: adminName, userDeleted: userDeleted, userSearchData: userSearchData })

    }
    else {

        req.session.adminLoginError = 'Try to signing'

        res.redirect('/admin')
    }
}


const admin_postUserPageSearch = async (req, res) => {


    try {

        const userName = req.body.search;



        console.log('===========   username   =======', userName)

        const regex = new RegExp(`${userName}`,'i')

        console.log(regex)

        const userSearchData = await collection.find({ name: { $regex: new RegExp(`${userName}`, 'i') }, isAdmin: false })

        console.log(userSearchData[0])

        if (userSearchData !== null || userSearchData !== undefined) {

            console.log(userSearchData[0])

            req.session.userSearchData = userSearchData

            const adminName = req.session.adminName

            const userDeleted = req.session.userDeleted



            res.render('adminHome', { user: userSearchData, adminName: adminName, adminChange: '', userDeleted: userDeleted })

        } else {

            console.log('get into else case')

            req.session.userNotFound = 'User not found kindly check the spelling'

            res.redirect('/admin/users')

        }

        console.log(typeof userSearchData)


    } catch (error) {

        console.log(error.message)

    }

}


const admin_deleteUser = async (req, res) => {

    if (req.session.isAuth) {

        try {

            const name = req.query.name;

            console.log(name)

            await collection.deleteOne({ name: name })

            req.session.userDeleted = `${name} deleted successfully`

            res.redirect('/admin/users')

        } catch (error) {

            console.log(error.message)
        }

    } else {

        req.session.adminLoginError = 'Try to signing'

        res.redirect('/admin')

    }




}



//!SECTION  ==============================================================                  Ending of DELETE ROUTER         =============================




const admin_getEditUser = async (req, res) => {

    if (req.session.isAuth) {

        const email = req.query.email

        req.session.orginalEmail = email

        const userData = await collection.findOne({ email: email }, { _id: 0 })

        req.session.editUserName = userData

        console.log(userData)

        const duplicateEmail = req.session.duplicateEmail

        const userDataError = req.session.userDataError

        res.render('userEdit', { user: userData, duplicateEmail: duplicateEmail,userDataError: userDataError })

    } else {

        res.redirect('/admin')

    }



}


const admin_postEditUser = async (req, res) => {

    try {

        if (req.session.isAuth) {

            const data = {

                email: req.body.email,
                
                name: req.body.name

            }

            if(!isValidName(data.name)){

                req.session.userDataError = 'invalid email id'

                res.redirect('/admin/edit-user')

            }

            if(!isvalidEmail(data.email)){

                req.session.userDataError = 'invalid email id'

                return res.redirect('/admin/edit-user')

            }


            const orginalEmail = req.session.orginalEmail

            const duplicateEmail = await collection.findOne({ email: data.email })

            console.log(duplicateEmail, 'duplicate email')

            if (duplicateEmail === null) {

                await collection.updateOne({ email: orginalEmail }, { $set: { name: req.body.name, email: req.body.email } })

                res.redirect('/admin/users')

            }

            const oldName = req.session.editUserName

            if (oldName.name !== req.body.name) {

                await collection.updateOne({ email: orginalEmail }, { $set: { name: req.body.name } })

                res.redirect('/admin/users')

            }
            if (duplicateEmail !== null) {

                req.session.duplicateEmail = 'Email already kindly change it'

                console.log('hlelo')

                res.redirect('/admin/edit-user')

            }



        }


    } catch (error) {

        console.log(error.message)
    }

    console.log('==============================', req.body)

}







const admin_getAddUser = (req, res) => {

    if (req.session.isAuth) {

        const emailError = req.session.emailError

        const userDataError = req.session.userDataError

        res.render('addUser', { duplicateEmail: emailError,userDataError:userDataError })

    } else {


        res.redirect('/admin')
    }

}


const admin_postAddUser = async (req, res) => {

    try {
        if (req.session.isAuth) {

            const data = {

                email: req.body.email,
                password: req.body.password,
                name: req.body.name

            }

            console.log('hai')

            if(!isValidName(data.name)){

                req.session.userDataError = 'Invalid username'

                res.redirect('/admin/admin-addUser')
            }

            if(!isvalidEmail(data.email)){

                req.session.userDataError = 'email is invalid'

                res.redirect('/admin/admin-addUser')
            }

            if(!isValidPassword(data.password)){

                req.session.userDataError = 'password must contain one letter and one number atleast 8 characters'

                res.redirect('/admin/admin-addUser')        
            }



            const userAlready = await collection.findOne({ email: data.email }, { _id: 0, email: 1 })

            console.log(userAlready)

            if (userAlready === null) {

                const hashPassword = await bcrypt.hash(req.body.password, 10)

                const data = {

                    name: req.body.name,

                    password: hashPassword,

                    email: req.body.email

                }
                console.log('recieved')

                await collection.insertMany([data])

                res.redirect('/admin/users')

            } else if (userAlready !== null) {

                if (data.email === userAlready.email) {

                    req.session.emailError = 'email id already exist please try another email id'

                    res.redirect('/admin/admin-addUser')
                }
            } else {

                res.redirect('/admin')



            }
        }

    } catch (error) {

        console.log(error.me)

    }

}


const admin_logout = (req, res) => {

    req.session.destroy()

    console.log('wprking or not')

    res.redirect('/admin')

}



//SECTION -  ===============================================================================              module exporting               ================================================================


module.exports = {

    admin_loginGet,
    admin_loginPost,
    admin_userPage,
    admin_postUserPageSearch,
    admin_deleteUser,
    admin_getEditUser,
    admin_postEditUser,
    admin_logout,
    admin_getAddUser,
    admin_postAddUser,

}

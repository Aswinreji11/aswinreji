
const collection = require('../src/mongodb')

const bcrypt = require('bcrypt')

const validator = require('email-validator');




const admin_loginGet = (req, res) => {

    if (req.session.isAuth) {

        res.redirect('/admin/users')

    } else {

        const message = req.session.adminError

        const adminLoginError = req.session.adminLoginError

        res.render('admin', { errMsg: message, loginErrorAdmin: adminLoginError })

    }

}

const admin_loginPost = async (req, res) => {

    try {

        const data = {

            name : req.body.name,

            email: req.body.email,
        }

        const userdata = await collection.findOne({ name: data.name }, {})

        console.log(userdata)

        const hashPassword = await collection.findOne({ name: data.name }, { _id: 0, password: 1 })


        if (userdata === null || hashPassword === null || userdata.isAdmin === false) {

            req.session.adminError = 'Invalid admin or password'

            res.redirect('/admin')
        }



        else if (userdata.name !== null && hashPassword !== null && userdata.isAdmin === true) {

            const comparedHashPassword = await bcrypt.compare(req.body.password, hashPassword.password)

            console.log(comparedHashPassword)

            const data = {

                name: req.body.name,

                password: comparedHashPassword

            }

            req.session.adminname = data.name

            if (userdata.name === data.name && comparedHashPassword) {

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



const admin_postUserPageSearch = async (req, res) => {


    try {

        const userName = req.body.search;



        console.log('===========   username   =======', userName)

        const userSearchData = await collection.find({ name: userName })

        console.log(userSearchData[0].name)

        if(userSearchData !== null){
            
            console.log(userSearchData[0].name)

            req.session.userSearchData = userSearchData

        }else {

            req.session.userNotFound = 'User not found kindly check the spelling'

            res.redirect('/admin/users')

        }

        console.log(typeof userSearchData)


    } catch (error) {

        console.log(error.message)

    }

}



const admin_userPage = async (req, res) => {

    if (req.session.isAuth) {

        const userdata = await collection.find({ isAdmin: false }, { _id: 0 })



        const adminName = req.session.adminname

        const adminError = req.session.adminDelete

        const adminSuccess = req.session.adminSuccess

        const userDeleted = req.session.userDeleted

        const userSearchData = req.body.userSearchData

        res.render('adminHome', { user: userdata , adminName: adminName, adminMsg: adminError, adminChange: adminSuccess, userDeleted: userDeleted,userSearchData:userSearchData })

    }
    else {

        req.session.adminLoginError = 'Try to signing'

        res.redirect('/admin')
    }
}

const admin_deleteUser = async (req, res) => {

    if (req.session.isAuth) {

        try {

            const name = req.query.name;

            console.log(name)

            const adminOrNot = await collection.findOne({ name: name })

            if (adminOrNot.isAdmin !== true) {

                await collection.deleteOne({ name: name })

                req.session.userDeleted = `${name} deleted successfully`

                res.redirect('/admin/users')


            } else {

                req.session.adminDelete = 'Cannot delete admin'

                res.redirect('/admin/users')

            }

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

    const name = req.query.name

    req.session.userEditOrginalName = name

    const userdata = await collection.findOne({ name: name }, { _id: 0 })

    console.log(userdata)

    res.render('userEdit', { user: userdata })


}


const admin_postEditUser = async (req, res) => {



    try {

        if (req.session.isAuth) {


            const OGName = req.session.userEditOrginalName

            console.log(OGName)

            const userdata = await collection.updateOne({ name: OGName }, { $set: { name: req.body.name, email: req.body.email } })

            console.log('===============', userdata)

            res.redirect('/admin/users')

        } else {

            res.redirect('/admin')

        }
    } catch (error) {

        console.log(error.message)
    }

    console.log('==============================', req.body)

}







const admin_logout = (req, res) => {

    req.session.destroy()

    console.log('wprking or not')

    res.redirect('/admin')

}


const admin_getAddUser = (req, res) => {

    if (req.session.isAuth) {

        res.render('adduser')

    } else {


        res.redirect('/admin')
    }

}


const admin_postAddUser = async (req, res) => {


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

        res.redirect('/admin/users')

    } else if (userAlready !== null) {

        if (trimmedName === userAlready.name) {

            req.session.error = 'username already exist please try another username'

            res.redirect('/admin')
        }
    }
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
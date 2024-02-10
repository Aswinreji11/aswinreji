
const adminRouteController = require('../Controller/adminRouteController')

const express = require('express');

const router = express.Router()



router.get('/admin',adminRouteController.admin_loginGet)

router.post('/admin',adminRouteController.admin_loginPost)

router.get('/admin/users',adminRouteController.admin_userPage)

router.post('/admin/users',adminRouteController. admin_postUserPageSearch)

router.get('/admin/delete-user',adminRouteController.admin_deleteUser)

router.get('/admin/edit-user',adminRouteController.admin_getEditUser)

router.post('/admin/edit-user',adminRouteController.admin_postEditUser)

router.get('/admin/admin-addUser',adminRouteController.admin_getAddUser)

router.post('/admin/admin-addUser',adminRouteController.admin_postAddUser)

router.get('/admin/logout',adminRouteController.admin_logout)

module.exports = router;








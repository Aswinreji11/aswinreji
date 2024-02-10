

const userRouteController = require('../Controller/userRouteController')

const express = require('express')

const router = express.Router()

 

router.get('/login',userRouteController.user_loginGet)

router.post('/login',userRouteController.user_loginPost)

router.get('/home',userRouteController.user_home1)

router.get('/',userRouteController.user_home2)
 
router.get('/logout',userRouteController.user_logout)

router.get('/signup',userRouteController.user_signupGet)

router.post('/signup',userRouteController.user_signupPost)



module.exports = router;
 
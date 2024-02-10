const express = require('express');
const session = require('express-session');
const nocache = require('nocache');
const userRouter = require('./route/userRouter')
const adminRouter = require('./route/adminRoutes');
//instance of express framework
const app = express();

//make static css file pulic
app.use(express.static('public')) 

//middleware to convert query to string or array
app.use(express.urlencoded({extended:false}))
 

//view engine embedded js
app.set('view engine','ejs') 

//nocache middleware to remove cache of browser
app.use(nocache())


//listening to request
app.listen( 3000, () => {
    console.log('server running in port 3000')
})
 
app.use(session({
    secret:'this is the secret key',
    resave:false,
    saveUninitialized:false,
}))


app.get('/test',(req,res)=>{
    res.render('index')
})
 
//user router
app.use('/',userRouter)

//admin router 
app.use('/',adminRouter)


 
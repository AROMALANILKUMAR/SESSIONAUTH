const express=require('express')
var bodyParser=require("body-parser")
var cookieParser=require("cookie-parser")
var session=require("express-session")
var morgan=require("morgan")


const app=express()
const User=require('./models/User')

app.set("port",4000)


app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(session({
    key:'user_sid',
    secret:"thisisrandomstuf",
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:600000
    }

})
)

app.use((re,res,next)=>
{
    if(req.session.user && req.cookies.user_sid){
      res.redirect('/dashboard')  
    }
    next()
})

var sessionchecker=(req,res,next)=>{
    if(req.session.user && req.cookies.user_sid){
        res.redirect('/dashboard')
    }
    else{
        next()
    }
    }
app.get('/',sessionchecker,(req,res)=>{
    res.redirect('/login')
})

app.route('/login')
.get(sessionchecker,(req,res)=>{
res.sendFile(__dirname+'/public/login.html')
}
)


app.route('/signup')
.get(sessionchecker,(req,res)=>{
res.sendFile(__dirname+'/public/signup.html')
}
)

.post((req,res)=>{
    var user= new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    })

    user.save((err,docs)=>{
        if(err){
            res.redirect('/signup')
        }
        else{
            console.log(docs)
            req.session.user=docs
            res.redirect('/dashboard')
        }
    })
})


app.get("/dashboard",(req,res)=>{
    if(req.session.user && req.cookies.user_sid){
        res.sendFile(__dirname +"/public/dashboard")
    }else{
        res.redirect("/login")
    }
})

app.listen(app.get("port"),()=>
{
    console.log("App is listening on port 4000")
})
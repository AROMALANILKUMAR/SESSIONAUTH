const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
mongoose.connect("mongodb://127.0.0.1:27017/user",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const userSchema=mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
},
password:{
    type:String,
    required:true
},
})
userSchema.pre('save',function(next){
    if(this.isModified("password")){
      return next()  
    }


this.password=bcrypt.hashSync(this.password,10)
next()
}
)
userSchema.method.comparePassword = function(plainText,callback){
    return callback(null,bcrypt.compareSync(plainText,this.password))
}
const userModel= mongoose.model("user",userSchema)
module.exports=userModel
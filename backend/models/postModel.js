const mongoose = require('mongoose')
const postSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,

    },
    caption:{
        type:String,
        default:''
    },
    image:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    

})

module.exports = mongoose.model('posts',postSchema)
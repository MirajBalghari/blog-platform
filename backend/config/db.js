const mongoose = require('mongoose')

const db= mongoose.connect(process.env.Mongo_url)
.then(()=>console.log('mogodb connected'))
.catch((err)=> console.log(`some error in mongodb connection ${err}`))

module.exports=db
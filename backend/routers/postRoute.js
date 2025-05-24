const { addPost, updatePost, deletePost, getAllPost, getOnePost, like, comment } = require('../controllers/postController');
const authUser = require('../middlewars/authUser');
const postUpload = require('../middlewars/postUpload');

const postRouter = require('express').Router()

postRouter.post('/addpost', authUser, postUpload.single('file'), addPost)
postRouter.get('/getallpost', getAllPost)
postRouter.put('/updatepost/:id', authUser, postUpload.single('file'), updatePost)
postRouter.get('/getonepost/:id', authUser, getOnePost)
postRouter.delete('/deletepost/:id', authUser, deletePost)
postRouter.get('/like/:id', authUser, like)
postRouter.post('/comment/:id', authUser, comment)



module.exports = postRouter;
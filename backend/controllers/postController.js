const userModel = require('../models/userModel')
const postModel = require('../models/postModel')
const cloudinary = require('../config/cloud')
const fs = require('fs');
const notificationModel = require('../models/notificationModel')
const { getIo } = require('../socket/socketInit')


const addPost = async (req, res) => {
    try {
        const { title, caption } = req.body;

        const authorid = req.user._id;
        const user = await userModel.findById(authorid);

        if (!user) return res.status(401).json({ msg: 'user not fount' })

        const file = await cloudinary.uploader.upload(req.file.path)


        const post = await postModel.create({
            title,
            caption,
            image: file.secure_url,
            author: authorid
        })

        user.posts.push(post._id)
        await user.save()
        await post.populate({ path: 'author' })
        fs.unlinkSync(req.file.path)
        return res.status(201).json({ msg: 'New post Add', post });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: 'Add post error', error })
    }
}


const getAllPost = async (req, res) => {
    try {
        const post = await postModel.find().populate('author', 'id name email profilePic ')
            .populate('comment.user', 'id name email profilePic')
            .sort({ createdAt: -1 })
        return res.status(200).json({ post })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: 'get  post error', error })
    }
}


const getOnePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.user._id;
        const post = await postModel.findById(postId)
        if (!post) return res.status(404).json({ msg: 'Post not found' })
        if (post.author.toString() !== authorId.toString()) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }
        return res.status(201).json({ post })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: 'getone post error', error })
    }
}



const updatePost = async (req, res) => {
    try {
        const { title, caption } = req.body;
        const postId = req.params.id;
        const authorId = req.user._id;

        const post = await postModel.findById(postId);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        if (post.author.toString() !== authorId.toString()) {
            return res.status(403).json({ msg: "Unauthorized to update this post" });
        }

        if (title) post.title = title;
        if (caption) post.caption = caption;

        if (req.file) {
            if (post.image) {
                const publicurl = post.image.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(publicurl)
            }

            const uploadImage = await cloudinary.uploader.upload(req.file.path)
            post.image = uploadImage.secure_url
            fs.unlinkSync(req.file.path)
        }

        await post.save();
        return res.status(200).json({ msg: "Post updated successfully", post });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Update post error', error });
    }
};


const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.user._id;

        const post = await postModel.findById(postId);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        if (post.author.toString() !== authorId.toString()) {
            return res.status(403).json({ msg: "Unauthorized to delete this post" });
        }

        if (post.image) {
            const publicurl = post.image.split('/').pop().split('.')[0]
            await cloudinary.uploader.destroy(publicurl)
        }

        const deletedPostId = post._id.toString();

        await postModel.findByIdAndDelete(postId);
        await userModel.findByIdAndUpdate(authorId, { $pull: { posts: deletedPostId } });

        return res.status(200).json({ msg: "Post deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error deleting post", error });
    }
};


const like = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id
        const post = await postModel.findById(postId)
        if (post.like.includes(userId.toString())) {

            post.like = post.like.filter((id) => id.toString() !== userId.toString())
            await post.save()

            getIo().emit('updateLike', { postId, like: post.like })

            await notificationModel.findOneAndDelete({
                receiver: post.author,
                type: 'like',
                relatedPost: postId,
                relatedUser: userId
            })

            return res.status(200).json({ msg: 'Disliked post ', success: true, post })

        } else {
            post.like.push(userId)
        }
        await post.save()
        getIo().emit('updateLike', { postId, like: post.like })
        if (userId !== post.author.toString()) {
            await notificationModel.create({
                receiver: post.author,
                type: 'like',
                relatedPost: postId,
                relatedUser: userId
            })
        }
        return res.status(200).json({ msg: 'Liked post ', success: true, post })

    } catch (error) {
        console.log(error)

        return res.status(500).json({ msg: 'internal like post error', error, success: false })
    }
}

const comment = async (req, res) => {
    try {
        const userId = req.user._id
        const postId = req.params.id
        const { content } = req.body

        if (!content) {
            return res.status(400).json({ msg: 'Comment content is required', success: false });
        }
        const post = await postModel.findByIdAndUpdate(postId, {
            $push: { comment: { content: content, user: userId } }
        }, { new: true }).populate('comment.user', 'name email profilePic ')
        if (userId !== post.author.toString()) {
            await notificationModel.create({
                receiver: post.author,
                type: "comment",
                relatedPost: postId,
                relatedUser: userId
            })
        }

        getIo().emit('sendComment', { postId, comm: post.comment })
        return res.status(200).json({ msg: 'comment send', success: true, post })

    } catch (error) {
        console.log(error)

        return res.status(500).json({ msg: 'internal like post error', error, success: false })
    }
}





module.exports = { addPost, getAllPost, updatePost, getOnePost, deletePost, like, comment }
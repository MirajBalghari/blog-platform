const userModel = require('../models/userModel')
const postModel = require('../models/postModel')
const fs = require('fs');
const path = require('path');


const addPost = async (req, res) => {
    try {
        const { title, caption } = req.body;

        const authorid = req.user._id;
        const user = await userModel.findById(authorid);
        const file = req.file.filename;


        if (!user) return res.status(401).json({ msg: 'user not fount' })
        const post = await postModel.create({
            title,
            caption,
            image: file,
            author: authorid
        })
        user.posts.push(post._id)
        await user.save()
        await post.populate({ path: 'author' })
        return res.status(201).json({ msg: 'New post Add', post });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ msg: 'Add post error', error })
    }
}


const getAllPost = async (req, res) => {
    try {
        const post = await postModel.find().populate('author')
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
                const oldImageFilename = path.basename(post.image);
                const oldImagePath = path.join(__dirname, "..", "uploads", "posts", oldImageFilename);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }


            post.image = req.file.filename;
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
            const imagePath = path.join(__dirname, "..", "uploads", "posts", path.basename(post.image));


            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

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

module.exports = { addPost, getAllPost, updatePost, getOnePost, deletePost }
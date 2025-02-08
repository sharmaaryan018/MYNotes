const Post = require('../models/post');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags, image } = req.body;
    const userId = req.user.id; // Assuming authentication middleware adds user info to req.user

    // Check if user is an alumni
    const user = await User.findById(userId);
    if (user.role !== 'Alumni') {
      return res.status(403).json({ message: 'Only alumni can create posts' });
    }

    const post = await Post.create({
      title,
      content,
      tags,
      image,
      author: userId,
    });

    // Add post reference to user's posts array
    user.posts.push(post._id);
    await user.save();

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'firstName lastName profileImage');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a specific post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'firstName lastName profileImage');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, tags, image } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the logged-in user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags || post.tags;
    post.image = image || post.image;

    await post.save();
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the logged-in user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await post.remove();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

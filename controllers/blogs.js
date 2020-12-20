const blogsRouter = require('express')
  .Router();
require('express-async-errors');
const _ = require('lodash');

const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
  let blogs = await Blog.find({})
    .populate('user');
  blogs = await blogs.map((blog) => blog.toJSON());
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const user = await User.findById(req.body.userID);
  let blog = _.pick(req.body, ['title', 'author', 'url', 'likes']);
  blog = {
    ...blog,
    user: user._id,
  };
  blog = new Blog(blog);

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  res.status(201)
    .json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204)
    .end();
});

blogsRouter.put('/:id', async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, _.pick(req.body, ['title', 'author', 'url', 'likes']),
    {
      new: true,
      runValidators: true,
      context: 'query',
    });
  if (updatedBlog) {
    return res.json(updatedBlog.toJSON());
  }
  return res.status(404)
    .send({ error: 'requested resource not found' });
});

module.exports = blogsRouter;

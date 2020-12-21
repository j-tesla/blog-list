const jwt = require('jsonwebtoken');
const blogsRouter = require('express')
  .Router();
require('express-async-errors');
const _ = require('lodash');

const Blog = require('../models/blog');
const User = require('../models/user');
const config = require('../utils/config');
const errors = require('../utils/errors');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase()
    .startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get('/', async (req, res) => {
  let blogs = await Blog.find({})
    .populate('user');
  blogs = await blogs.map((blog) => blog.toJSON());
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const { body } = req;

  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, config.SECRET);
  if (!token || !decodedToken.id) {
    throw new errors.AuthorizationError('token missing or invalid');
  }

  const user = await User.findById(decodedToken.id);
  let blog = _.pick(body, ['title', 'author', 'url', 'likes']);
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
  const { body } = req;

  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, config.SECRET);
  if (!token || !decodedToken.id) {
    throw new errors.AuthorizationError('token missing or invalid');
  }

  const user = await User.findById(decodedToken.id);
  const blogToUpdate = await Blog.findById(req.params.id);
  if (user._id.toString() !== blogToUpdate.user.toString()) {
    throw new errors.AuthorizationError('user does not have access to write the requested resource');
  }
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, _.pick(body, ['title', 'author', 'url', 'likes']),
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

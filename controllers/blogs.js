const blogsRouter = require('express')
  .Router();
require('express-async-errors');
const _ = require('lodash');

const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  let blogs = await Blog.find({});
  blogs = await blogs.map((blog) => blog.toJSON());
  res.json(blogs);
});

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(_.pick(req.body, ['title', 'author', 'url', 'likes']));

  let result = await blog.save();
  result = result.toJSON();
  res.status(201)
    .json(result);
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

const blogsRouter = require('express')
  .Router();

const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  let blogs = await Blog.find({});
  blogs = await blogs.map((blog) => blog.toJSON());
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  let result = await blog.save();
  result = result.toJSON();
  response.status(201)
    .json(result);
});

module.exports = blogsRouter;

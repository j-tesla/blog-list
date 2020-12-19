const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjs = helper.initialBlogs
    .map((blog) => new Blog(blog));

  const promises = blogObjs.map((blogObj) => blogObj.save());
  await Promise.all(promises);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all notes are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200);
  expect(response.body)
    .toHaveLength(helper.initialBlogs.length);
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd)
    .toHaveLength(helper.initialBlogs.length + 1);
});

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api
    .get('/api/blogs');
  response.body.forEach((blog) => {
    expect(blog.id)
      .toBeDefined();
  });
});

test('likes property is defaulted to zero', async () => {
  const newBlog = {
    title: 'This blog is not Liked',
    author: 'Jayanth PSY',
    url: 'https://localhost:8080',
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201);
  expect(response.body.likes)
    .toBe(0);
});

test('title is mandatory for a blog', async () => {
  const invalidBlog = {
    author: 'Jayanth PSY',
    url: 'https://localhost:8080',
    likes: 5,
  };
  await api
    .post('/api/blogs')
    .send(invalidBlog)
    .expect(400);
});

test('url is mandatory for a blog', async () => {
  const invalidBlog = {
    title: 'Is url field mandatory?',
    author: 'Jayanth PSY',
    likes: 1,
  };
  await api
    .post('/api/blogs')
    .send(invalidBlog)
    .expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});

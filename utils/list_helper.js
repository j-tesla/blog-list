const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((total, blog) => total + blog.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined;

  const favBlog = blogs.reduce((fav, blog) => ((blog.likes > fav.likes) ? blog : fav), blogs[0]);
  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined;
  const authors = _.countBy(blogs, 'author');
  const maxBlogs = _.max(Object.values(authors));
  return {
    author: Object.keys(authors)[_.indexOf(Object.values(authors), maxBlogs)],
    blogs: maxBlogs,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};

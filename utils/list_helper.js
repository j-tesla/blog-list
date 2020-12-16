const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((total, blog) => total + blog.likes, 0);

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  const favBlog = blogs.reduce((fav, blog) => ((blog.likes > fav.likes) ? blog : fav), blogs[0]);
  return {
    title: favBlog.title,
    author: favBlog.author,
    likes: favBlog.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};

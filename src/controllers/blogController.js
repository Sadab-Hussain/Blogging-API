const createError = require('http-errors');
const Blog = require('../models/Blog');

// CREATE a new blog post
exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, tags = [], isPublished = true } = req.body;
    if (!title || !content) return next(createError(400, 'Missing fields'));
    const blog = await Blog.create({ title, content, tags, isPublished, author: req.user.id });
    res.status(201).json({ success: true, data: blog });
  } catch (e) {
    next(e);
  }
};

// READ - LIST (List all blog posts)
exports.listBlogs = async (req, res, next) => {
  try {
    const { q, tag, author, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const filter = { isDisabled: false, isPublished: true };
    if (tag) filter.tags = tag;
    if (author) filter.author = author;

    let query = Blog.find(filter);

    if (q) {
      query = Blog.find({ ...filter, $text: { $search: q } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
    } else {
      query = query.sort(sort);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      query.skip(skip).limit(Number(limit)).populate('author', 'name'),
      Blog.countDocuments(filter)
    ]);

    res.json({ success: true, data: items, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (e) {
    next(e);
  }
};

// READ - ONE (tweak: also hide disabled)
exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog
      .findOne({ _id: req.params.id, isDisabled: false })
      .populate('author', 'name');

    if (!blog) return next(createError(404, 'Blog not found'));
    res.json({ success: true, data: blog });
  } catch (e) { next(e); }
};

// UPDATE a blog post (author or admin)
exports.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, tags, isPublished } = req.body;

    let blog = await Blog.findById(id);
    if (!blog) return next(createError(404, 'Blog not found'));

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to update this blog'));
    }

    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (tags !== undefined) blog.tags = tags;
    if (isPublished !== undefined) blog.isPublished = isPublished;

    blog = await blog.save();

    res.json({ success: true, data: blog });
  } catch (e) {
    next(e);
  }
};

// DELETE Blog (soft delete via isDisabled = true)
exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog || blog.isDisabled) return next(createError(404, 'Blog not found'));

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to delete this blog'));
    }

    blog.isDisabled = true;
    await blog.save();

    res.json({ success: true, message: 'Blog deleted' });
  } catch (e) { next(e); }
};
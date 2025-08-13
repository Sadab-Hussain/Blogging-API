const createError = require('http-errors');
const Blog = require('../models/Blog');

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

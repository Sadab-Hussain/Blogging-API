const { Schema, model, Types } = require('mongoose');
const slugify = require('slugify');

const blogSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  content: { type: String, required: true },
  tags: [{ type: String, index: true }],
  author: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  isPublished: { type: Boolean, default: true },
  isDisabled: { type: Boolean, default: false },
  disabledBy: { type: Types.ObjectId, ref: 'User' },
  disabledAt: { type: Date }
}, { timestamps: true });

blogSchema.index({ title: 'text', content: 'text' }, { weights: { title: 5, content: 1 } });

blogSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = model('Blog', blogSchema);

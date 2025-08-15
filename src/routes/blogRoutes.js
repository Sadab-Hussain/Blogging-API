const router = require('express').Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/blogController');

router.get('/', ctrl.listBlogs);
router.post('/', auth(), ctrl.createBlog);
router.get('/:id', ctrl.getBlogById);

module.exports = router;

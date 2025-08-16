const router = require('express').Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/blogController');

router.get('/', ctrl.listBlogs);                // list
router.post('/', auth(), ctrl.createBlog);      // create (auth)
router.get('/:id', ctrl.getBlogById);           // read one
router.patch('/:id', auth(), ctrl.updateBlog);  // update (auth)
router.delete('/:id', auth(), ctrl.deleteBlog); // delete (auth)

module.exports = router;

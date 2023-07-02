const express = require('express');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const {createPost, editPost, viewPosts, getSinglePost} = require('../controllers/post');

const router = express.Router();


router.post('/post', uploadMiddleware.single('file'), createPost);
router.get('/post', viewPosts);
router.get('/post/:id', getSinglePost);
router.put('/post',uploadMiddleware.single('file') ,editPost);


module.exports = router;
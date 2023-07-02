const express = require('express');
const {login, register, getProfile, logout} = require('../controllers/user');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', getProfile);
router.post('/logout', logout);

module.exports = router;
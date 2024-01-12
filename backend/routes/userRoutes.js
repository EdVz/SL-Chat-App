const express = require('express');
const { registerUser, loginUser, logoutUser, searchUser } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, searchUser);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

module.exports = router;
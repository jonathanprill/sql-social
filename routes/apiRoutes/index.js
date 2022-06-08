const express = require('express');
const router = express.Router();

router.use(require('./userRoutes'));
router.use(require('./platformRoutes'));
router.use(require('./followerRoutes'));

module.exports = router;
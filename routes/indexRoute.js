const express = require('express');
const router = express.Router();
const controller = require('../controller/indexController');

router.get('/', controller.index);
router.post('/translate', controller.translate)



module.exports = router;
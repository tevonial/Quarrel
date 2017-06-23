var express = require('express');
var router = express.Router();

router.use('/auth',     require('./controller/auth'));
router.use('/account',  require('./controller/account'));
router.use('/control',  require('./controller/control'));

router.use('/user',     require('./controller/user'));
router.use('/thread',   require('./controller/thread'));

module.exports = router;
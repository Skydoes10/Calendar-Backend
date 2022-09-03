/* 
    User routes / auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validateJWT');

const router = Router();

router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password must be longer than 5 characters').isLength({ min: 6 }),
    validateFields
], createUser);

router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password must be longer than 5 characters').isLength({ min: 6 }),
    validateFields
], loginUser);

router.get('/renew', validateJWT, renewToken);

module.exports = router;

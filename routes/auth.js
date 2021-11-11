const express = require("express");
const router = new express.Router();
const User = require('./users');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const ExpressError = require("../expressError");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (await User.authenticate(username, password)) {
            const token = jwt.sign({username}, SECRET_KEY)
            User.updateLoginTimestamp(username)
            return res.json({token})
        } else {
            throw new ExpressError("Incorrect Username/Password", 400)
        }   
    } catch (e) {
        next(e)
    }
    
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async ( req, res, next ) => {
    try {
        const {username, password, first_name, last_name, phone} = req.body;
        if (await User.register(username, password, first_name, last_name, phone)) {
            const token = jwt.sign({username}, SECRET_KEY)
            return res.json({token})
        } else {
            throw new ExpressError("Username taken!", 400)
        }
    } catch (e) {
        next(e)
    }
})
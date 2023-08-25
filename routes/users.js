const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', [
        check('name', 'Name is required with 30 or less characters').not().isEmpty().isLength({max: 30}),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({min: 6}),
    ] , async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { name, email, password } = req.body

    try {
        
        let user = await User.findOne({ email })
        // Check if user exist
        if (user) {
            return res.status(400).json({errors: [{msg: 'User already exists'}]})
        }
        user = new User({
            name,
            email,
            password
        })
        // Encrypt Password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        res.send(' user created ')

    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router;
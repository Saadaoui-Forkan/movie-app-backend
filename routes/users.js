const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwtHeelpers = require('../utils/jwtHelpers')
const auth = require('../middlewares/auth')

// @route   POST api/users/register
// @desc    Register new user
// @access  Public
router.post('/register', [
        check('name', 'Name is required with less than 30 characters').not().isEmpty().isLength({max: 30}),
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

// @route   POST api/users/login
// @desc    User Login
// @access  Public
router.post('/login', [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({min: 6}),
    ] , async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { email, password } = req.body

    try {
        
        let user = await User.findOne({ email })
        
        if (user && bcrypt.compareSync(password, user.password)) {
            res.json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    accessToken: jwtHeelpers.sign({ sub: user.id })
                }
            })
        } else {
            return res.status(400).json({errors: [{msg: 'User already exists'}]})

        }

    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
})

// @route   GET api/users/me
// @desc    User Authentification
// @access  Public
router.get('/me', auth.check, async(req, res) => {
    const user = await User.findById(req.userId)
    res.json({
        success: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    })
})

module.exports = router;
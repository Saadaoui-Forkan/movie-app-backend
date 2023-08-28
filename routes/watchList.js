const express = require('express')
const router = express.Router()
// const Movie = require('../models/Movie')
const User = require('../models/User')
const auth = require('../middlewares/auth')

// @route   POST api/watchList
// @desc    watchList
// @access  Public
router.post('/', auth.check, async(req,res) => {
    const { movie, watched } = req.body
    const user = await User.findById(req.userId)
    const index = user.watchList.findIndex(e => e.movie == movie)
    if(index > -1) {
        user.watchList[index].watched = watched
    } else{
        user.watchList.push({ movie, watched })
    }

    await user.save()
    res.json({
        success: true
    })
})

// @route   DELETE api/watchList
// @desc    Delete watchList
// @access  Public
router.delete('/:movie', auth.check, async(req,res) => {
    const { movie } = req.params
    const user = await User.findById(req.userId)
    user.watchList = user.watchList.filter(e => e.movie != movie)
    await user.save()
    res.json({
        success: true
    })
})

// @route   GET api/watchList
// @desc    Get list of watchList
// @access  Public
router.get('/', auth.check, async(req,res) => {
    const user = await User.findById(req.userId)
        .select('-watchList._id')
        .populate('watchList.movie', ['name', 'category', 'rate'])

    res.json({
        success: true,
        data: user.watchList
    })

})

module.exports = router;
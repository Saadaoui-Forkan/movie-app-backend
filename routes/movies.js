const express = require('express')
const router = express.Router()
const Movie = require('../models/Movie')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const { check, validationResult } = require("express-validator");

// @route   POST api/movies
// @desc    create a movie
// @access  Public
router.post('/', 
    [
        auth.check, 
        admin.check, 
        [
            check("name", "Name is required").not().isEmpty(),
            check("category", "Category is required").not().isEmpty(),
            check("description", "Description is required").not().isEmpty()
        ]
    ], 
    async(req, res) => {
        // Validate a Movie
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, category, description } = req.body
        const movie = Movie({ name, category, description })
        await movie.save()

        res.json({
            success: true,
            data: movie
        })
})

// @route   PUT api/movies/:id
// @desc    Update a movie
// @access  Public
router.put('/:id', [auth.check, admin.check], async(req, res) => {
    const { id } = req.params
    const { name, category, description } = req.body
    await Movie.updateOne(
        {_id: id},
        {
            $set: {
                name, category, description
            }
        }
    )
    res.json({success: true})
})

// @route   DELETE api/movies
// @desc    Delete a movie
// @access  Public
router.delete('/:id', [auth.check, admin.check], async(req, res) => {
    const { id } = req.params
    await Movie.deleteOne({ _id: id })
    res.json({success: true})
})

// @route   GET api/movies
// @desc    Get all movies
// @access  Public
router.get('/', async(req, res) => {
    const page = req.query?.page || 1
    const limit = 1
    const skip = (page - 1) * limit
    const movies = await Movie.find().select('-reviews').skip(skip).limit(limit)
    const total = await Movie.countDocuments()
    const pages = Math.ceil(total/limit)
    res.json({
        success: true,
        pages,
        data: movies
    })
})

// @route   GET api/movies/:id
// @desc    Get a movie informations
// @access  Public
router.get('/:id', async(req, res) => {
    const { id } = req.params
    const movie = await Movie.findById(id)
    if(!movie) return res.status(404).send()
    res.json({
        success: true,
        data: movie
    })
})

module.exports = router;
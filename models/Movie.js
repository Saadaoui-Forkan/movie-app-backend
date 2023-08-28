const mongoose = require('mongoose')

const ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        default: 0
    },
    reviews: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                comment: String,
                rate: Number
            }
        ],
        default: []
    }
}, {
    timestamps: true
})

ModelSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,  // hidden _v in database
    transform: (doc, ret) => {
        delete ret._id  // delete _id in db
    }
})

const Model = mongoose.model('Movie', ModelSchema);

module.exports = Model
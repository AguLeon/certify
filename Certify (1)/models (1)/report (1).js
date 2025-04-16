const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = {
    toJSON: {
        virtuals: true
    }
};

const ReportSchema = new Schema({
    brand: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    model: String,
    year: Number,
    location: String,
    condition: Number,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);


ReportSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/reports/${this._id}">${this.brand} ${this.model}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


ReportSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Report', ReportSchema);
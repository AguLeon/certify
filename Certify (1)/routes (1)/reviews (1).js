const express = require('express');
const router = express.Router({
    mergeParams: true
});
const {
    validateReview,
    isLoggedIn,
    isReviewAuthor,
    isAuthor
} = require('../middleware');
const Report = require('../models/report');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
const wrapAsync = require('../utils/wrapAsync');



// Reviews routes

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview))


module.exports = router
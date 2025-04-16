const {
    reportSchema,
    reviewSchema
} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Report = require('./models/report');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login');
    }
    next();
}


module.exports.validateReport = (req, res, next) => {
    const {
        error
    } = reportSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


module.exports.isAuthor = async (req, res, next) => {
    const {
        id
    } = req.params;
    const report = await Report.findById(id);
    if (!report.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/reports/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {
        id,
        reviewId
    } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/reports/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {
        error
    } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
const Report = require('../models/report');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
    const report = await Report.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    report.reviews.push(review);
    await review.save();
    await report.save();
    req.flash('success', 'Created new review');
    res.redirect(`/reports/${report._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const {
        id,
        reviewId
    } = req.params;
    await Report.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/reports/${id}`);

};
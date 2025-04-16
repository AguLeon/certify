const Report = require('../models/report');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({
    accessToken: mapBoxToken
});
const {
    cloudinary
} = require("../cloudinary");


// Index
module.exports.index = async (req, res) => {
    const reports = await Report.find({});
    res.render('reports/index', {
        reports
    })
    // res.json({
    //     reports
    // })
};

// New
module.exports.renderNewForm = (req, res) => {
    res.render('reports/new');
};

// New (post)
module.exports.createReport = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.report.location,
        limit: 1
    }).send()
    const report = new Report(req.body.report);
    report.geometry = geoData.body.features[0].geometry;
    report.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    report.author = req.user._id
    await report.save();
    req.flash('success', 'Successfully made a new report');
    res.redirect(`/reports/${report._id}`)
};


// Show
module.exports.showReport = async (req, res, ) => {
    const report = await Report.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!report) {
        req.flash('error', 'Cannot find that report');
        return res.redirect('/reports');
    }
    res.render('reports/show', {
        report
    });
};


// Edit (get)
module.exports.renderEditForm = async (req, res) => {
    const {
        id
    } = req.params;
    const report = await Report.findById(id)
    if (!report) {
        req.flash('error', 'Cannot find that report');
        return res.redirect('/reports');
    }
    res.render('reports/edit', {
        report
    });
};

//  Edit (post)
module.exports.updateReport = async (req, res) => {
    const {
        id
    } = req.params;
    const report = await Report.findByIdAndUpdate(id, {
        ...req.body.report
    });
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    report.images.push(...imgs);
    await report.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await report.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImages
                    }
                }
            }
        })
    }
    req.flash('success', 'Succesfully updated report');
    res.redirect(`/reports/${report._id}`)
};


// Delete
module.exports.deleteReport = async (req, res) => {
    const {
        id
    } = req.params;
    const report = await Report.findById(id, 'images')
    for (let filename of report.images.map(f => f.filename)) {
        await cloudinary.uploader.destroy(filename);
    }
    await Report.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted report')
    res.redirect('/reports');
};
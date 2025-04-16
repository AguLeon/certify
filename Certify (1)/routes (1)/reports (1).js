const express = require('express');
const router = express.Router();
const reports = require('../controllers/reports');
const wrapAsync = require('../utils/wrapAsync');
const {
    isLoggedIn,
    isAuthor,
    validateReport
} = require('../middleware');
const multer = require('multer');
const {
    storage
} = require('../cloudinary');
const upload = multer({
    storage
});

const Report = require('../models/report');


// Routes


router.route('/')
    .get(wrapAsync(reports.index))
    .post(isLoggedIn, upload.array('image'), validateReport, wrapAsync(reports.createReport))


router.get('/new', isLoggedIn, reports.renderNewForm)

router.route('/:id')
    .get(wrapAsync(reports.showReport))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateReport, wrapAsync(reports.updateReport))
    .delete(isLoggedIn, isAuthor, wrapAsync(reports.deleteReport))


router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(reports.renderEditForm))



module.exports = router;
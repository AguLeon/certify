const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const {
            email,
            username,
            password
        } = req.body;
        const user = new User({
            email,
            username
        });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Certify!');
            res.redirect('/reports');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    const {
        username
    } = req.body;
    req.flash('success', `Welcome back, ${username}!`);
    const redirectUrl = req.session.returnTo || '/reports';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    // req.session.destroy();
    req.flash('success', "You've signed out");
    res.redirect('/reports');
};
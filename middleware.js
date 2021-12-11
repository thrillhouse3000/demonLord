const Sheet = require('./models/sheet');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login')
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const sheet = await Sheet.findById(id);
    if (!sheet.author.equals(req.user._id)) {
        req.flash('error', 'This is not your character!');
        return res.redirect('/sheets')
    }
    next();
}
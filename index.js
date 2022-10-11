const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Sheet = require('./models/sheet');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const {isLoggedIn} = require('./middleware')
const {isAuthor} = require('./middleware')



const dbUrl = 'mongodb://localhost:27017/demonLord';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'chickenParm',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('pages/main')
})

app.get('/sheets', isLoggedIn, async (req, res) => {
    const sheets = await Sheet.find({});
    req.flash('success', 'Remember to Save often!'); 
    res.render('sheets/index', {sheets})
})

app.get('/sheets/new', isLoggedIn, (req, res) => {
    res.render('sheets/new')
})

app.post('/sheets', isLoggedIn, async (req, res) => {
    const sheet = new Sheet(req.body.sheet);
    sheet.author = req.user._id;
    await sheet.save();
    res.redirect(`/sheets/${sheet._id}`)
})

app.get('/sheets/:id', async (req, res) => {
    const sheet = await Sheet.findById(req.params.id).populate('author');  
    res.render('sheets/character', {sheet});
})

app.put('/sheets/:id', isLoggedIn, isAuthor, async (req, res) => {
    const {id} = req.params;
    const sheet = await Sheet.findByIdAndUpdate(id, {...req.body.sheet});
    req.flash('success', 'Sheet Saved!');
    res.redirect(`/sheets/${sheet._id}`);
})

app.delete('/sheets/:id', isLoggedIn, isAuthor, async (req, res) => {
    const {id} = req.params;
    await Sheet.findByIdAndDelete(id);
    res.redirect('/sheets');
})

app.get('/register', (req, res) => {
    res.render('users/register')
})

app.post('/register', async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Account Created!');
            res.redirect('/sheets')
        })
        res.redirect('/sheets')
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
})

app.get('/login', (req, res) => {
    res.render('users/login')
})

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    res.redirect('/sheets')
})

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out.')
    res.redirect('/');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
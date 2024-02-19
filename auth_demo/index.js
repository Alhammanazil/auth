const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/auth_demo')
    .then(() => {
        console.log('Connected to DB');
    })
    .catch(err => {
        console.log('Error:', err.message);
    });

app.set('view engine', 'ejs');
app.set('views', 'views');

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: true
}));

const auth = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
};


// GET /register
app.get('/register', (req, res) => {
    res.render('register');
});

// GET /home
app.get('/', (req, res) => {
    res.render('home');
});

// POST /register
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password});
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/login');
});

// GET /login
app.get('/login', (req, res) => {
    res.render('login');
});

// POST /login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findByCredentials (username, password);
    if (user) {
            req.session.user_id = user._id;
            res.redirect('/admin');
        } else {
            res.redirect('/login');
        }
});

// POST /logout
app.post('/logout', auth, (req, res) => {
    req.session.user_id = null;
    res.redirect('/login');
});

// GET /admin
app.get('/admin', auth, (req, res) => {
    res.render('admin');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
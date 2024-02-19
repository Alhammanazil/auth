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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword});
    await user.save();
    res.redirect('/login');
});

// GET /login
app.get('/login', (req, res) => {
    res.render('login');
});

// POST /login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        const valid = await bcrypt.compare(password, user.password);
        if (valid) {
            req.session.user_id = user._id;
            res.redirect('/admin');
        } else {
            res.redirect('/login');
        }
    }
    else {
        res.send('Not Allowed');
    }
});

// GET /admin
app.get('/admin', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    }
    res.send('⭐ Admin Page');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
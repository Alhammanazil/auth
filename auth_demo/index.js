const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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


// GET /register
app.get('/register', (req, res) => {
    res.render('register');
});

// GET/home
app.get('/home', (req, res) => {
    res.send('HomePage');
});

// POST /register
app.get('/admin', (req, res) => {
    res.send('Admin Page');
});

// POST /register
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword});
    await user.save();
    res.redirect('/home');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
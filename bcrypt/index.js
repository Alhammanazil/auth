const bcrypt = require('bcrypt');

const hashPassword = async (pw) => {
    const hash = await bcrypt.hash(pw, 12);
    console.log(hash);
};

const login = async (pw, hashedPw) => {
    const result = await bcrypt.compare(pw, hashedPw);
    if (result) {
        console.log('Login successful');
    } else {
        console.log('Incorrect password');
    }
};

hashPassword('fiesta');

// login('fiesta', '$2b$12$NxnDZaf/z/hkbdF9bGT0geywRrqSdemDl2MSKvaij0rjSunjKams2');

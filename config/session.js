import crypto from 'crypto';

export default {
    secret: crypto.randomBytes(20).toString('hex'),
    name: 'cs-tt-sessn',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 6000 * 60 * 60, // example: 6 hours = 6000 * 60 * 60
    },
};

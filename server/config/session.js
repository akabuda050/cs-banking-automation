import crypto from 'crypto';

export default {
    secret: 'very-secret',//crypto.randomBytes(20).toString('hex'),
    name: 'cs-tt-sessn',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, // 1 hour
    },
};

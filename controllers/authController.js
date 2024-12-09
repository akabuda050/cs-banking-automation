import express from 'express';
import axios from 'axios';
import { ensureAuthenticated, ensureGuest } from '../middlewares/authMiddleware.js';
import session from '../config/session.js';

const router = express.Router();

/**
 * POST /cs/auth/callback
 * OAuth callback from CS API
 */
router.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).send('Missing code or state parameter');
    }

    try {
        // Exchange the authorization code for tokens
        const tokenResponse = await axios.post(
            `${process.env['CS_IDP_BASE_URI']}/token`,
            new URLSearchParams({
                code,
                client_id: process.env['CS_CLIENT_ID'],
                client_secret: process.env['CS_CLIENT_SECRET'],
                redirect_uri: process.env['CS_OAUTH_REDIRECT_URI'],
                grant_type: 'authorization_code',
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );
        req.session.tokens = tokenResponse.data;

        res.setHeader('Content-Type', 'text/html');
        res.write(`
            <script>window.location = '/'</script>
        `);
        res.end();
    } catch (error) {
        console.error('Error during OAuth callback:', error.message);
        res.status(400);
    }
});

router.get('/login', ensureGuest, (req, res) => {
    const url = `${process.env['CS_IDP_BASE_URI']}/auth`;
    const params = [
        `state=${process.env['CS_OAUTH_STATE']}`,
        `client_id=${process.env['CS_CLIENT_ID']}`,
        `redirect_uri=${process.env['CS_OAUTH_REDIRECT_URI']}`,
        `access_type=offline`,
        `response_type=code`,
    ];
    res.setHeader('Content-Type', 'text/html');
    res.write(`
        <script>window.location = '${url}?${params.join('&')}'</script>
    `);
    res.end();
});

/**
 * POST /api/auth/logout
 * Logs out a user and destroys the session.
 */
router.post('/logout', ensureAuthenticated, (req, res) => {
    console.log(req.cookies);
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie(session.name);
        res.status(200).json({ message: 'Logout successful' });
    });
});

export default router;

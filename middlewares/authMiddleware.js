import axios from 'axios';

export const ensureAuthenticated = async (req, res, next) => {
    if (!req.session.tokens) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const tokenResponse = await axios.post(
            `${process.env['CS_IDP_BASE_URI']}/token`,
            new URLSearchParams({
                client_id: process.env['CS_CLIENT_ID'],
                client_secret: process.env['CS_CLIENT_SECRET'],
                redirect_uri: process.env['CS_OAUTH_REDIRECT_URI'],
                grant_type: 'refresh_token',
                refresh_token: req.session.tokens.refresh_token,
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        req.session.tokens.access_token = tokenResponse.data.access_token;
    } catch (error) {
        console.error(error);
        req.session.destroy();

        return res.status(401).json({ message: 'Unable to refresh tokens' });
    }

    next();
};

export const ensureGuest = (req, res, next) => {
    if (req.session.tokens) {
        return res.status(403).json({ message: 'You are already logged in on this device.' });
    }

    next();
};

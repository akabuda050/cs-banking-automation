import express from 'express';
import axios from 'axios';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * POST /cs/api/accounts
 * Get accoutns info
 */
router.get('/accounts', ensureAuthenticated, async (req, res) => {
    const { size, page, sort, order } = req.query;

    try {
        // Exchange the authorization code for tokens
        const accountsResponse = await axios.get(`${process.env['CS_API_BASE_URL']}/v3/accounts/my/accounts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.session.tokens.access_token}`,
                'Web-Api-Key': `${process.env['CS_WEB_API_KEY']}`,
            },
            params: {
                size,
                page,
                sort,
                order,
            },
        });

        res.send(accountsResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

/**
 * POST /cs/api/accounts/:account/balance
 * Get accoutn balance info
 */
router.get('/accounts/:account/balance', ensureAuthenticated, async (req, res) => {
    const { account } = req.params;

    try {
        // Exchange the authorization code for tokens
        const balanceResponse = await axios.get(
            `${process.env['CS_API_BASE_URL']}/v3/accounts/my/accounts/${account}/balance`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${req.session.tokens.access_token}`,
                    'Web-Api-Key': `${process.env['CS_WEB_API_KEY']}`,
                },
            }
        );

        res.send(balanceResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

/**
 * POST /cs/api/accounts/:account/transactions
 * Get accoutn transactions info
 */
router.get('/accounts/:account/transactions', ensureAuthenticated, async (req, res) => {
    const { account } = req.params;
    const { fromDate, toDate, size, page, sort, order } = req.query;

    try {
        // Exchange the authorization code for tokens
        const transactionResponse = await axios.get(
            `${process.env['CS_API_BASE_URL']}/v3/accounts/my/accounts/${account}/transactions`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${req.session.tokens.access_token}`,
                    'Web-Api-Key': `${process.env['CS_WEB_API_KEY']}`,
                },
                params: {
                    fromDate,
                    toDate,
                    size,
                    page,
                    sort,
                    order,
                },
            }
        );

        res.send(transactionResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

/**
 * POST /cs/api/accounts/:account/cards
 * Get accoutn cards info
 */
router.get('/accounts/:account/cards', ensureAuthenticated, async (req, res) => {
    const { account } = req.params;
    const { cardType, size, page } = req.query;

    try {
        // Exchange the authorization code for tokens
        const cardsResponse = await axios.get(`${process.env['CS_API_BASE_URL']}/v3/accounts/my/cards`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.session.tokens.access_token}`,
                'Web-Api-Key': `${process.env['CS_WEB_API_KEY']}`,
            },
            params: {
                accountIds: [account],
                cardType,
                size,
                page,
            },
        });

        res.send(cardsResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

/**
 * POST /cs/api/accounts/:account/cards/:card/reservations
 * Get accoutn card reservations info
 */
router.get('/accounts/:account/cards/:card/reservations', ensureAuthenticated, async (req, res) => {
    const { account, card } = req.params;
    const { reservationState, size, page } = req.query;

    try {
        // Exchange the authorization code for tokens
        const cardsResponse = await axios.get(
            `${process.env['CS_API_BASE_URL']}/v3/accounts/my/cards/${card}/reservations`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${req.session.tokens.access_token}`,
                    'Web-Api-Key': `${process.env['CS_WEB_API_KEY']}`,
                },
                params: {
                    reservationState,
                    size,
                    page,
                },
            }
        );

        res.send(cardsResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

/**
 * POST /cs/api/accounts/:account/cards/:card/transactions
 * Get account card transactions info
 */
router.get('/accounts/:account/cards/:card/transactions', ensureAuthenticated, async (req, res) => {
    const { account, card } = req.params;
    const { fromBookingDay, toBookingDay, size, page } = req.query;

    try {
        // Exchange the authorization code for tokens
        const cardsResponse = await axios.get(
            `${process.env['CS_API_BASE_URL']}/v3/accounts/my/cards/${card}/transactions?`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${req.session.tokens.access_token}`,
                    'Web-Api-Key': `${process.env['CS_WEB_API_KEY']}`,
                },
                params: {
                    fromBookingDay,
                    toBookingDay,
                    size,
                    page,
                },
            }
        );

        res.send(cardsResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

/**
 * POST /cs/api/accounts/:account/cards/:card/reservation/notification
 * Get accoutns info
 */
router.get('/accounts/:account/cards/:card/reservations/notification', ensureAuthenticated, async (req, res) => {
    const { account, card } = req.params;
    console.log(card);
    try {
        // Exchange the authorization code for tokens
        const cardsResponse = await axios.get(
            `${process.env['CS_API_BASE_URL']}/v3/accounts/my/cards/${card}/reservations/notification`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${req.session.tokens.access_token}`,
                    'Web-Api-Key': `${process.env['CS_WEB_API_KEY']}`,
                },
            }
        );

        res.send(cardsResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

/**
 * POST /cs/api/accounts/:account/transactions/notification
 * Get accoutns info
 */
router.get('/accounts/:account/transactions/notification', ensureAuthenticated, async (req, res) => {
    const { account, card } = req.params;
    console.log(card);
    try {
        // Exchange the authorization code for tokens
        const cardsResponse = await axios.get(
            `${process.env['CS_API_BASE_URL']}/v3/accounts/my/accounts/${account}/notification`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${req.session.tokens.access_token}`,
                    'Web-Api-Key': `${process.env['CS_WEB_API_KEY']}`,
                },
            }
        );

        res.send(cardsResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});
export default router;

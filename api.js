import express from 'express';
import https from 'https';
import { login } from './auth.js';
import { convertToCsv, exportTransactions, mapTransactions } from './transactions.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.post('/cs/auth', async (req, res) => {
    const { account_number, account_day, account_month } = req.body;

    const response = await login(
        {
            account_number,
            account_day,
            account_month,
        },
        (authInfo) => {
            console.log(authInfo);
        }
    );

    return res.send({
        webApiKey: response.webApiKey,
        authorizationBearer: response.authorizationBearer,
    });
});

app.post('/cs/export/transactions', async (req, res) => {
    const webApiKey = req.get('web-api-key');
    const authorizationBearer = req.get('authorization');

    const { from, to } = req.body;

    const response = await exportTransactions(
        {
            webApiKey,
            authorizationBearer,
        },
        { from, to }
    );

    const mappedTransactions = mapTransactions(response.data);

    fs.writeFileSync(
        'transactions.csv',
        convertToCsv(mappedTransactions, {
            fields: [
                'date',
                'type',
                'referenceNumber',
                'description',
                'accountName',
                'accountNumber',
                'partnerNumber',
                'partnerName',
                'categories',
                'amount',
                'currency',
            ],
        })
    );

    return res.send(mappedTransactions);
});

app.get('/cs/auth/request', async (req, res) => {
    const url = `${process.env['CS_IDP_BASE_URI']}/auth`;
    const params = [
        `state=${process.env['CS_OAUTH_STATE']}`,
        `client_id=${process.env['CS_CLIENT_ID']}`,
        `redirect_uri=${process.env['CS_OAUTH_REDIRECT_URI']}`,
        `access_type=offline`,
        `response_type=code`,
    ];

    return res.redirect(`${url}?${params.join('&')}`);
});

app.get('/cs/auth/callback', async (req, res) => {
    if (!req?.query?.code) {
        return res.send('No code provided in oauth callback');
    }

    const url = `${process.env['CS_IDP_BASE_URI']}/token`;
    const params = {
        code: `${req.query.code}`,
        client_id: `${process.env['CS_CLIENT_ID']}`,
        client_secret: `${process.env['CS_CLIENT_SECRET']}`,
        redirect_uri: `${process.env['CS_OAUTH_REDIRECT_URI']}`,
        grant_type: `authorization_code`,
    };

    const tokensResponse = await axios.post(url, null, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        params,
    });

    return res.send(tokensResponse.data);
});

app.get('/', async (req, res) => {
    return res.send('App');
});

// Налаштування SSL
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'privkey.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

https.createServer(sslOptions, app).listen(443, () => {
    console.log('Сервер запущено на HTTPS (порт 443)');
});

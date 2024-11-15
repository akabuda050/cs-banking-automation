import express from 'express';
import { login } from './auth.js';
import { exportTransactions, mapTransactions } from './transactions.js';

const app = express();
const port = 3000;

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

    return res.send(mappedTransactions);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

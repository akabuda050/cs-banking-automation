import { config } from 'dotenv';

config();

export default {
    cs_login_url: process.env['CS_LOGIN_URL'] || undefined,
    cs_auth_request_url: process.env['CS_AUTH_REQUEST_URL'] || undefined,
    cs_auth_timeout: process.env['CS_AUTH_TIMEOUT'] || 30 * 1000, // 30 sec
    cs_transactions_export_url: process.env['CS_TRANSACTIONS_EXPORT_URL'] || undefined,
    headless: true, // set `false` to open browser on server
};

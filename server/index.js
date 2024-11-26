import app from './app.js';
import https from 'https';
import fs from 'fs';
import path from 'path';
const __dirname = import.meta.dirname;

import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'privkey.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
};

https.createServer(sslOptions, app).listen(443, () => {
    console.log('Сервер запущено на HTTPS (порт 443)');
});
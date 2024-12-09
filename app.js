import express from 'express';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import sessionConfig from './config/session.js';
import authRouter from './controllers/authController.js';
import csRouter from './controllers/csController.js';
import path from 'path';
import fs from 'fs';
import FileStore from 'session-file-store';
import { ensureAuthenticated } from './middlewares/authMiddleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const fileStore = FileStore(session);
app.use(
    session({
        store: new fileStore(),
        ...sessionConfig,
    })
);

// Routes
app.use('/cs/auth', authRouter);
app.use('/cs/api', csRouter);

app.get('/', ensureAuthenticated, (req, res) => {
    res.write(fs.readFileSync(path.resolve('index.html'), 'utf-8'));
    res.end();
});

export default app;

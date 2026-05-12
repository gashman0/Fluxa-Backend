import express from 'express';
import cors from 'cors';
import router from './routes/auth-routes.js';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: [
        "http://localhost:5188",
        process.env.CLIENT_URL
    ],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

app.use("/api", router);


export default app;
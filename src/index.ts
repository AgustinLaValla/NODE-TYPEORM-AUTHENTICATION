import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as cors from 'cors';
import * as helmet from 'helmet';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';

const PORT = process.env.PORT || 3000;

createConnection().then(async () => {

    // create express app
    const app = express();

    //Middleware
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    //Routes
    app.use('/user', userRoutes);
    app.use('/auth', authRoutes);

    // start express server
    app.listen(PORT, () => console.log(`Server on port: ${PORT}`));


}).catch(error => console.log(error));

import "reflect-metadata";
import express from 'express';
import cookieParser from 'cookie-parser';
import { requestErrorHandler } from "./presentation/middleware/requestErrorHandler";
import { dbConnect } from "./infrastructure/database/knex";

const app = express()

dbConnect()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', require('./presentation/routes'))
app.use(requestErrorHandler as express.ErrorRequestHandler)

export default app
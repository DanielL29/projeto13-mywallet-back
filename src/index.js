import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import recordRoutes from './routes/recordRoutes.js'

dotenv.config()

const app = express()
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
    preflightContinue: false,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/wallet', recordRoutes)

app.listen(process.env.PORT, () => 
    console.log(chalk.bgMagenta.white.bold(`Servidor executando na porta ${process.env.PORT}...`)))
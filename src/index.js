import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'
import { signup } from './APIs/auth.js'

const app = express()

app.use(cors())
app.use(express.json())
dotenv.config()

app.post('/sign-up', (req, res) => signup(req, res))

app.listen(process.env.PORT, () => 
    console.log(chalk.bgMagenta.white.bold(`Servidor executando na porta ${process.env.PORT}...`)))
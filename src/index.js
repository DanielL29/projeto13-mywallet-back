import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'
import { signUp, signIn } from './APIs/auth.js'

const app = express()

app.use(cors())
app.use(express.json())
dotenv.config()

app.post('/sign-up', (req, res) => signUp(req, res))
app.post('/sign-in', (req, res) => signIn(req, res))

app.listen(process.env.PORT, () => 
    console.log(chalk.bgMagenta.white.bold(`Servidor executando na porta ${process.env.PORT}...`)))
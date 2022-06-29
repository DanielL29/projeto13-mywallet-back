import express from 'express'
import cors from 'cors'
import chalk from 'chalk'
import dotenv from 'dotenv'
import { signUp, signIn } from './APIs/auth.js'
import { recordsGET, recordsPOST, recordsDELETE } from './APIs/record.js'

const app = express()

app.use(cors())
app.use(express.json())
dotenv.config()

app.post('/sign-up', (req, res) => signUp(req, res))
app.post('/sign-in', (req, res) => signIn(req, res))
app.get('/records', (req, res) => recordsGET(req, res))
app.post('/records', (req, res) => recordsPOST(req, res))
app.delete('/records/:id', (req, res) => recordsDELETE(req, res))

app.listen(process.env.PORT, () => 
    console.log(chalk.bgMagenta.white.bold(`Servidor executando na porta ${process.env.PORT}...`)))
require('dotenv').config()
console.log(process.env)
const bcryptjs = require('bcryptjs')

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { Client } = require('pg')
const res = require('express/lib/response')

const client = new Client({
  user: process.env.PG_USUARIO,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PORT,
})

client.connect()

client.query('SELECT NOW()', (err, res) => {
  // console.log(err, res);
})

console.log(__dirname)
console.log(__filename)

app.set('view engine', 'hbs')

const rutaDePublic = path.join(__dirname, '../public')
console.log(rutaDePublic)
app.use(express.static(rutaDePublic))

app.use(bodyParser.json({ type: 'application/json' }))

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.get('', (req, res) => {
  res.send('Estamos en la ruta raiz!')
})

app.get('/about', (req, res) => {
  res.render('about', {
    nombre: 'Misael',
    apellido: 'Calvillo Mancilla',
  })
})

app.get('/gastos', (req, res) => {
  // Obtener los gastos de la base de datos
  res.render('gastos', {
    gastos: [],
  })
})

app.get('/test', (req, res) => {
  res.send({
    hola: 'hola',
    cantidad: 2,
  })
})

app.post('/suma', (req, res) => {
  const body = req.body
  console.log(body)

  const suma = body.cantidad1 + body.cantidad2

  console.log(suma)
  // responder la suma de dos numeros
  res.send(String(suma))
})

app.post('/registro', async (req, res) => {
  const body = req.body
  const email = body.email
  const password = body.password
  const name = body.name
  const nickname = body.nickname
  const photo_url = body.photo_url
  const user_role = body.user_role
  const user_status = body.user_status
  const resRegistro = body.resRegistro

  let passwordHash = await bcryptjs.hash(password, 8)
  console.log({
    email,
    password,
  })

  //SQL Guardar en base de datos
  const query = {
    text: 'INSERT INTO users(email, password, name, nickname, photo_url,user_status,user_role ) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    values: [
      email,
      passwordHash,
      name,
      nickname,
      photo_url,
      user_status,
      user_role,
    ],
  }
  // const query = {
  //   text: 'INSERT INTO usuarios (email,password) VALUES ($1,$2)',
  //   values: [email, password],
  // }

  client.query(query, (err, respuesta) => {
    if (err) {
      console.log(err.stack)
      return res.status(400).json({ message: 'HUBO UN ERROR' })
    } else {
      console.log(respuesta.rows[0])
      res.send({
        respuesta: `El registro fue exitoso del usuario ${email} fue existoso.`,
      })
    }
  })
})

app.post('/gasto', (req, res) => {
  // Crear gasto en base de datos

  res.send('Se creo un gasto')
})

app.listen(3000, () => {
  console.log('El server acaba de inicial en el puerto 3000')
})

// CRUD
// Create
// Read
// Delete
// Update

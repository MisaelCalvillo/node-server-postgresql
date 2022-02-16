require('dotenv').config();
console.log(process.env);

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Client } = require('pg');
const res = require('express/lib/response');
const async = require('hbs/lib/async');

const client = new Client({
  user: process.env.PG_USUARIO,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PORT
});

client.connect();

client.query('SELECT NOW()', (err, res) => {
  // console.log(err, res);
});

console.log(__dirname);
console.log(__filename);

app.set('view engine', 'hbs');

const rutaDePublic = path.join(__dirname, '../public');
console.log(rutaDePublic);
app.use(express.static(rutaDePublic));

app.use(bodyParser.json({ type: 'application/json'}))

// Logger 
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('', (req, res) => {
  res.send('Estamos en la ruta raiz!');
});

// VISTA
app.get('/about', (req, res) => {
  res.render('about', {
    nombre: 'Misael',
    apellido: 'Calvillo Mancilla'
  })
});

// VISTA
app.get('/gastos', (req, res) => {
  // Obtener los gastos de la base de datos
  res.render('gastos', {
    gastos: []
  });
});

// VISTA
app.get('/test', (req, res) => {
  res.send({
    hola: 'hola',
    cantidad: 2
  });
});

app.post('/suma', (req, res) => {
  const body = req.body;
  const suma = body.cantidad1 + body.cantidad2;
  
  console.log(suma);
  // responder la suma de dos numeros 
  res.send(String(suma))
});

app.post('/registro', (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;
  
  console.log({
    email, 
    password
  });

  // SQL Guardar en base de datos

  // responder la suma de dos numeros 
  res.send({ respuesta: `El registro fue exitoso del usuario ${email} fue existoso.` });
});

app.post('/registrar-movimiento', async (req, res) => {
  const body = req.body;
  const monto = body.monto;
  const categoria = body.categoria;
  const user_id = body.user_id;
  
  console.log({
    monto, 
    categoria
  });

  // SQL Guardar en base de datos
  const query = {
    text: 'INSERT INTO movimientos (user_id, amount, category) VALUES ($1, $2, $3)',
    values: [user_id, monto, categoria],
  }

  const query2 = {
    text: `SELECT * FROM movimientos WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1;`,
    values: [user_id]
  }

  try {
    console.log("respuesta");
    const respuesta = await client.query(query)
    console.log(respuesta)
  } catch (err) {
    console.log(err.stack)
    res.status(400).json({
      error: err.message
    })
  }

  let movimiento = null;
  //try {
    const respuesta = await client.query(query2)
    movimiento = respuesta.rows[0];
    console.log(respuesta.rows[0]);
  /*} catch (error) {
    console.log(error.stack)
  }*/
  res.status(200).json(movimiento);

  /*if (err) {
    console.log(err.stack)
    return respuesta.send('Hubo un erro :(');
  } else {
    console.log(respuesta.rows[0])
    return respuesta.send('Acabo de registrar tu ' + (categoria) + ' por ' + (monto) + ' !');
  }*/
  // responder la suma de dos numeros 
  //res.send({ respuesta: `Usuario: ${user_id} Acabo de registrar tu ${categoria} por ${monto}` });
});

app.post('/gasto', (req, res) => {
  // Crear gasto en base de datos
  res.send('Se creo un gasto');
});

app.listen(3000, () => {
  console.log('El server acaba de inicial en el puerto 3000');
}); 


// CRUD 
// Create
//  - Crear un elemnto (data) genera el (id)
// Read 
//  - Un solo elemento (id)
//  - Lista de elementos (filtros)
// Update 
//  - Actualizar un solo elemento (id)
// Delete 
//  - Borrar un solo elemento (id)

// Users 
// POST "/users" - REGISTRO
app.post('/users', (req, res) => {
  console.log('POST /users');
  
  // VALIDA DATOS
  if (!req.body.name) {
    return res.status(400).json({ 
      error: 'error-creating-user', 
      message: 'No pude crear el usuario' 
    });
  }

  // CONECTAMOS A POSTGRES
  const user = {};

  // LÓGICA (opt)
  return res.status(200).json({ user });
});

// GET "/users?startDate=2022-01-01&endDate=2020-02-01" - LISTA DE USERS
app.get('/users', (req, res) => {
  console.log('GET /users');
  // VALIDA DATOS
  // CONECTAMOS A POSTGRES
  res.status(200).json({ respuesta: 'hola'});
});
// GET "/users/:id" - INICIO SESIÓN Y REGISTRO
app.get('/users/:id', (req, res) => { 
  console.log('GET /users/:id');
  // VALIDA DATOS
  // CONECTAMOS A POSTGRES
  res.status(200).json({});
});
// POST "/users/:id" - ACTUALIZAR
app.post('/users/:id', (req, res) => { 
  console.log('POST /users/:id');
  res.status(200).json({});
});
// DELETE "/users/:id" - BORRAR USUARIOS

// NINGUNO REGRESA UNA VISTA - 
// DEBEN REGRESAR DATOS (JSON)

// Movements
// POST "/movements" - CREAR MOV.
// GET "/movements/:id" - VER DETALLES DE UN MOV. 
// GET "/movements?startDate=2022-01-01&endDate=2020-02-01" - LISTA DE MOV.
// POST "/movements/:id" - ACTUALIZAR MOV.
// DELETE "/movements/:id" - BORRAR MOV. 

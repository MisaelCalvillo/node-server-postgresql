require('dotenv').config();

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Client } = require('pg');
const moment = require('moment');
moment.locale('es-mx');

// const sql = require('sql');
const formatNumber = require('format-number');

const client = new Client({
  user: process.env.PG_USUARIO,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PORT
});

client.connect();

app.set('view engine', 'hbs');

const rutaDePublic = path.join(__dirname, '../public');
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

app.use(express.static(rutaDePublic));

app.get('/data', (req, res) => {
  res.render('index', {
    title: 'Movimientos',
    method: 'Listar - Filtrar '
  })
});

app.get('/movimientos', (req, res) => {
  let { inicio, fin }= req.query
  let complement= ` as m join "usuarios" as u on m.user_id=u.id `;
  if(!inicio && !fin){
    complement+= ''
  }
  else{
    if(!fin || fin===inicio){
      complement += `WHERE CAST(m.created_at AS Date)='${inicio}'`
    }
    else{
      if(!inicio) 
        inicio="2000-01-01"
      complement += `WHERE CAST(m.created_at AS Date)>='${inicio}' AND CAST(m.created_at AS Date)<='${fin}'`;
    }
  }
  
  client.query(`SELECT m.id, u.nickname, u.name, m.created_at, m.amount FROM "movimientos"${complement};`, (err, postgresRes) => {
    if (err) {          
      console.log(err);
      return res.status(403).send('Estamos trabando para poner en linea esto :('); // temporal
    } else {
      let  newData = postgresRes.rows;
      return res.status(200).json({
        data: newData
      });
    }
  })  
})

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

app.post('/gasto', (req, res) => {
  // Crear gasto en base de datos
  res.send('Se creo un gasto');
});
const port_server=process.env.PORT_NODE
app.listen(port_server, () => {
  console.log(`El server acaba de inicial en el puerto ${port_server}`);
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
// POST "/movements/:id" - ACTUALIZAR MOV
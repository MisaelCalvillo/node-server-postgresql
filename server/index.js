require('dotenv').config();
console.log(process.env);

const path = require('path');
const express = require('express');
const app = express();
const { Client } = require('pg');
const res = require('express/lib/response');
const bodyParser = require('body-parser'); // Body parsing
const http = require('http'); // built-in module to transfer data over HTTP

const client = new Client({
  user: process.env.PG_USUARIO,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PORT
});

client.connect();

client.query('SELECT NOW()', (err, res) => {
  console.log(err, res);
});

console.log(__dirname);
console.log(__filename);

app.set('view engine', 'hbs');

const rutaDePublic = path.join(__dirname, '../public');
console.log(rutaDePublic);
app.use(express.static(rutaDePublic));

// Logger 
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.get('', (req, res) => {
  res.send('Estamos en la ruta raiz!');
});

app.get('/about', (req, res) => {
  res.render('about', {
    nombre: 'Misael',
    apellido: 'Calvillo Mancilla'
  })
});

app.get('/gastos', (req, res) => {
  // Obtener los gastos de la base de datos
  res.render('gastos', {
    gastos: []
  });
});

// Renderizar el archivo login.hbs
app.get('/login', (req, res) => {
  res.render('login', {});
});







/*
app.get('/login', (req, res) => {
  //console.log(JSON.stringify(req.body));
  //console.log(JSON.stringify(req.body.password));
  //res.render('login');
  //res.send("Tengo estos datos "+req.body.username+ " and "+req.body.password);
});*/

app.post('/gasto', (req, res) => {
  // Crear gasto en base de datos
  res.send('Se creo un gasto');
});





app.listen(3000, () => {
  console.log('El server acaba de inicial en el puerto 3000');
}); 


// CRUD 
// Create
// Read 
// Delete 
// Update 

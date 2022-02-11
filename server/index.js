require('dotenv').config();
console.log(process.env);

const path = require('path');
const express = require('express');
const app = express();
const { Client } = require('pg');
const res = require('express/lib/response');

const client = new Client({
  user: process.env.PG_USUARIO,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
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

app.get('', (req, res) => {
  res.send('Estamos en la ruta raiz!');
});

app.get('/about', (req,res) => {
  res.render('about', {
    nombre: 'Adrian',
    apellido: 'Nieto'
  })
});

app.get('/gastos', (req, res) => {
  // Obtener los gastos de la base de datos
  res.render('gastos', {
    gastos: []
  });
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
// Read 
// Delete 
// Update 

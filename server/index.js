require('dotenv').config(); //Esta paqueteria se utiliza para poder configurar el .env
const path = require('path');
const express = require('express');
const app = express();
const {Client} = require('pg');

const client = new Client({
  user: process.env.PG_USUARIO,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
});

client.connect();

client

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
  res.render('gastos', {
    gastos: []
  });
});

app.post('/gasto', (req,res) => {
  res.send('Se registro un gasto');
})

app.listen(3001, () => {
  console.log('El server acaba de inicial en el puerto 3001rs');
}); 
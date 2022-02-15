require('dotenv').config();
console.log(process.env);

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Client } = require('pg');
const res = require('express/lib/response');

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

app.post('/registrar-movimiento', (req, res) => {
  const body = req.body;
  const monto = body.monto;
  const categoria = body.categoria;
  
  console.log({
    monto, 
    categoria
  });

  // SQL Guardar en base de datos
  const query = {
    text: 'INSERT INTO movimientos (amount, category) VALUES ($1, $2)',
    values: [monto, categoria],
  }

  client.query(query, (err, respuesta) => {
    if (err) {
      console.log(err.stack)
      return res.send('Hubo un erro :(');
    } else {
      console.log(respuesta.rows[0])
      return res.send('Acabo de registrar tu ' + (categoria) + ' por ' + (monto) + ' !');
    }
  })
  // responder la suma de dos numeros 
  res.send({ respuesta: `Acabo de registrar tu ${categoria} por ${monto}` });
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

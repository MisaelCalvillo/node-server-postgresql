require('dotenv').config()
console.log(process.env)
const bcryptjs = require('bcryptjs')

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { Client } = require('pg');
const http = require('http'); // built-in module to transfer data over HTTP

//inicializar variables de sesion

const cookieParser = require('cookie-parser');
const sessions = require('express-session');

const client = new Client({
  user: process.env.PG_USUARIO,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PORT,
})

client.connect(); //es para conectar

//configurar la session de middleware
app.use(sessions({
  secret : "my secret",
  saveUninitialized : true,
  cookie : { maxAge:60000 },
  resave: false

}))

//middleware de cookie parser
app.use(cookieParser());

var session; //variable para guardar la session

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

//parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

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

/*
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
*/

// Renderizar el archivo login.hbs
app.get('/login', (req, res) => {
  session = req.session;
  //console.log(session.email);
  //como if para verificar si hay session activa 
  if(session.email){ //trae el dato para compararlo y mandar como sesion iniciada
    return res.status(200).json(session.email);
  }
  else{
    res.render('login', {});
  }
 
});

// Traer los datos del HTML form de login.hbs en el body del request (req.body)
app.post('/login', (req, res) => {
//se trago del body de html (username y password)
  const body = req.body;
  const email = body.email;
  const password = body.password;

  //console.log('HHHHHH',email, password)

   client.query(`SELECT * FROM users WHERE email='${email}';`, (err, respuesta) => {
       if (err) {
         console.log(err.stack); //stack es parte de un objeto, y como stack detalla el error.
         return res.send('Oops! Algo salió mal') // Error del query
       } else {
         if ( respuesta.rowCount === 0 ){ // Cuando no regresa datos el query. Vacío
            return res.status(400).json({error: 'Tu e-mail no se encuentra en la DB'});
         }
         const userData = respuesta.rows[0]; 
         const encryptedPassword = userData.password;
         const isCorrect = bcryptjs.compareSync(password, encryptedPassword);
         //console.log(isCorrect);
         if (isCorrect) {
            session = req.session;
            session.email = req.body.email; 
            return res.status(200).json(userData); // Query exitoso
         }
            return res.status(400).json({error: 'Tu password es incorrecto'});
       }
       //client.end(); //cerrar la conexión con la db
     })
});

//esto es para cerrar sessions
app.get('/logout', (req, res)=>{
  req.session.destroy();
  console.log(session);
  res.redirect('/');
  
})

// VISTA
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
  console.log('POST /users')

  // VALIDA DATOS
  if (!req.body.name) {
    return res.status(400).json({
      error: 'error-creating-user',
      message: 'No pude crear el usuario',
    })
  }

  // CONECTAMOS A POSTGRES
  const user = {}

  // LÓGICA (opt)
  return res.status(200).json({ user })
})

// GET "/users?startDate=2022-01-01&endDate=2020-02-01" - LISTA DE USERS
app.get('/users', (req, res) => {
  console.log('GET /users')
  // VALIDA DATOS
  // CONECTAMOS A POSTGRES
  res.status(200).json({ respuesta: 'hola' })
})
// GET "/users/:id" - INICIO SESIÓN Y REGISTRO
app.get('/users/:id', (req, res) => {
  console.log('GET /users/:id')
  // VALIDA DATOS
  // CONECTAMOS A POSTGRES
  res.status(200).json({})
})
// POST "/users/:id" - ACTUALIZAR
app.post('/users/:id', (req, res) => {
  console.log('POST /users/:id')
  res.status(200).json({})
})
// DELETE "/users/:id" - BORRAR USUARIOS

// NINGUNO REGRESA UNA VISTA -
// DEBEN REGRESAR DATOS (JSON)

// Movements
// POST "/movements" - CREAR MOV.
// GET "/movements/:id" - VER DETALLES DE UN MOV.
// GET "/movements?startDate=2022-01-01&endDate=2020-02-01" - LISTA DE MOV.
// POST "/movements/:id" - ACTUALIZAR MOV.
// DELETE "/movements/:id" - BORRAR MOV.
// Read
// Delete
// Update
